<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Support\CustomerOrderLogData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderLogController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Customer/OrderLogs/Index', [
            'sessions' => CustomerOrderLogData::sessionsForUser($request->user()),
        ]);
    }
}
