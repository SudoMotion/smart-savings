<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('earning_wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->decimal('balance', 14, 2)->default(0);
            $table->timestamps();
        });

        User::query()->each(function (User $user) {
            $user->earningWallet()->firstOrCreate([], ['balance' => 0]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('earning_wallets');
    }
};
