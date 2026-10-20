<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->unsignedInteger('global_order_limit')->nullable()->change();
        });

        Schema::table('user_order_limits', function (Blueprint $table) {
            $table->unsignedInteger('order_limit')->change();
        });
    }

    public function down(): void
    {
        Schema::table('settings', function (Blueprint $table) {
            $table->decimal('global_order_limit', 14, 2)->nullable()->change();
        });

        Schema::table('user_order_limits', function (Blueprint $table) {
            $table->decimal('order_limit', 14, 2)->change();
        });
    }
};
