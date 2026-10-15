<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PercentageController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $percentage = (float) ($user->percentage ?? 0);

        return Inertia::render('Customer/Percentage/Index', [
            'percentage' => $percentage,
            'formatted_percentage' => number_format($percentage, 2, '.', ''),
        ]);
    }
}
