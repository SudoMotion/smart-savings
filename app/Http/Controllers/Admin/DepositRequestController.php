<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DepositRequestStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectDepositRequestRequest;
use App\Models\DepositRequest;
use App\Services\DepositRequestService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class DepositRequestController extends Controller
{
    public function __construct(
        private DepositRequestService $depositRequestService
    ) {}

    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $query = DepositRequest::query()
            ->with(['user:id,name,email', 'depositOption:id,coin_type,value'])
            ->latest();

        if ($status && in_array($status, ['under_review', 'approved', 'rejected'], true)) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                    ->orWhere('coin_type', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $depositRequests = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/DepositRequests/Index', [
            'depositRequests' => $depositRequests,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'counts' => [
                'all' => DepositRequest::count(),
                'under_review' => DepositRequest::where('status', DepositRequestStatus::UnderReview)->count(),
                'approved' => DepositRequest::where('status', DepositRequestStatus::Approved)->count(),
                'rejected' => DepositRequest::where('status', DepositRequestStatus::Rejected)->count(),
            ],
            'can' => [
                'review' => auth()->user()?->can('deposit-requests.review') ?? false,
            ],
        ]);
    }

    public function approve(DepositRequest $depositRequest): RedirectResponse
    {
        abort_unless(auth()->user()?->can('deposit-requests.review'), 403);

        try {
            $this->depositRequestService->approve($depositRequest, auth()->user());
        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['deposit' => $e->getMessage()]);
        }

        return back()->with('success', 'Deposit approved and wallet balance updated.');
    }

    public function reject(RejectDepositRequestRequest $request, DepositRequest $depositRequest): RedirectResponse
    {
        try {
            $this->depositRequestService->reject(
                $depositRequest,
                $request->user(),
                $request->validated('admin_note')
            );
        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['deposit' => $e->getMessage()]);
        }

        return back()->with('success', 'Deposit request rejected.');
    }
}
