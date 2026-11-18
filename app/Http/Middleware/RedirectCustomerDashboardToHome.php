<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectCustomerDashboardToHome
{
    /**
     * Customer dashboard is retired; send authenticated users to the homepage.
     */
    public function handle(Request $request, Closure $next): Response
    {
        return redirect()->route('home');
    }
}