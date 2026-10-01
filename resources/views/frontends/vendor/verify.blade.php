@extends('layouts.app')

@section('content')
<div class="max-w-md mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">Verify Your Email</h1>

    <p class="text-center mb-6 text-gray-600">
        We've sent a verification code to {{ $email }}.
    </p>

    <p class="text-center mb-6 text-gray-600">
        This code will expire in 10 minutes.
    </p>

    <form method="POST" action="{{ route('vendor.verify.code') }}">
        @csrf
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700" for="code">
                Verification Code
            </label>
            <input
                type="text"
                id="code"
                name="code"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border-gray-600"
                placeholder="Enter your 6-digit verification code"
            >
        </div>

        <div class="flex items-center justify-between">
            <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Verify Code
            </button>
        </div>

        <div class="mt-4">
            <p class="text-center text-gray-500 text-sm">
                Don't have a code? <a href="{{ route('vendor.verify') }}" class="text-indigo-600 hover:text-indigo-800">Request a new code</a>
            </p>
        </div>
    </form>
</div>
@endsection