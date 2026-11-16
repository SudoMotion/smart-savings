<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('referral_tiers', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('referral_from');
            $table->unsignedInteger('referral_to')->nullable();
            $table->decimal('reward_amount', 14, 2);
            $table->timestamps();
        });

        DB::table('referral_tiers')->insert([
            [
                'referral_from' => 1,
                'referral_to' => 5,
                'reward_amount' => 7.5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'referral_from' => 6,
                'referral_to' => 10,
                'reward_amount' => 10.5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('referral_tiers');
    }
};
