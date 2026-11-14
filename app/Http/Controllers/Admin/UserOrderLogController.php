<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\CustomerOrderLogData;
use Inertia\Inertia;
use Inertia\Response;

class UserOrderLogController extends Controller
{
    public function index(User $user): Response
    {
        return Inertia::render('Admin/Users/OrderLogs', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'sessions' => CustomerOrderLogData::sessionsForUser($user),
        ]);
    }
}
