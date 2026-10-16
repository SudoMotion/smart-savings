<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_order_limits', function (Blueprint $table) {
            $table->string('order_reset_interval', 32)->nullable()->after('order_limit');
        });
    }

    public function down(): void
    {
        Schema::table('user_order_limits', function (Blueprint $table) {
            $table->dropColumn('order_reset_interval');
        });
    }
};
