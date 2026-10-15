<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DepositRequestStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectWithdrawRequestRequest;
use App\Models\WithdrawRequest;
use App\Services\WithdrawRequestService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class WithdrawRequestController extends Controller
{
    public function __construct(
        private WithdrawRequestService $withdrawRequestService
    ) {}

    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $query = WithdrawRequest::query()
            ->with(['user:id,name,email', 'depositOption:id,coin_type'])
            ->latest();

        if ($status && in_array($status, ['under_review', 'approved', 'rejected'], true)) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('wallet_address', 'like', "%{$search}%")
                    ->orWhere('coin_type', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $withdrawRequests = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/WithdrawRequests/Index', [
            'withdrawRequests' => $withdrawRequests,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'counts' => [
                'all' => WithdrawRequest::count(),
                'under_review' => WithdrawRequest::where('status', DepositRequestStatus::UnderReview)->count(),
                'approved' => WithdrawRequest::where('status', DepositRequestStatus::Approved)->count(),
                'rejected' => WithdrawRequest::where('status', DepositRequestStatus::Rejected)->count(),
            ],
            'can' => [
                'review' => auth()->user()?->can('withdraw-requests.review') ?? false,
            ],
        ]);
    }

    public function approve(WithdrawRequest $withdrawRequest): RedirectResponse
    {
        abort_unless(auth()->user()?->can('withdraw-requests.review'), 403);

        try {
            $this->withdrawRequestService->approve($withdrawRequest, auth()->user());
        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['withdraw' => $e->getMessage()]);
        }

        return back()->with('success', 'Withdraw approved and wallet balance updated.');
    }

    public function reject(RejectWithdrawRequestRequest $request, WithdrawRequest $withdrawRequest): RedirectResponse
    {
        try {
            $this->withdrawRequestService->reject(
                $withdrawRequest,
                $request->user(),
                $request->validated('admin_note')
            );
        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['withdraw' => $e->getMessage()]);
        }

        return back()->with('success', 'Withdraw request rejected.');
    }
}
