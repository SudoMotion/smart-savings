<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\ProcessCustomerOrderRequest;
use App\Models\Product;
use App\Services\CustomerOrderService;
use App\Support\WalletData;
use Illuminate\Http\RedirectResponse;
use InvalidArgumentException;

class CustomerOrderController extends Controller
{
    public function confirm(ProcessCustomerOrderRequest $request, Product $product): RedirectResponse
    {
        try {
            $earned = (new CustomerOrderService())->confirm($request->user(), $product);
        } catch (InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }

        $message = $earned > 0
            ? 'Order confirmed. $'.WalletData::format($earned).' was added to your earning wallet.'
            : 'Order confirmed. No earning was added because your deposit balance or percentage is zero.';

        return back()->with('success', $message);
    }

    public function reject(ProcessCustomerOrderRequest $request, Product $product): RedirectResponse
    {
        try {
            (new CustomerOrderService())->reject($request->user(), $product);
        } catch (InvalidArgumentException $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Order declined.');
    }
}
