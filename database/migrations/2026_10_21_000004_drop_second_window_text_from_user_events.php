<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('user_events', 'second_window_text')) {
            return;
        }

        Schema::table('user_events', function (Blueprint $table) {
            $table->dropColumn('second_window_text');
        });
    }

    public function down(): void
    {
        Schema::table('user_events', function (Blueprint $table) {
            $table->text('second_window_text')->nullable()->after('first_window_text');
        });
    }
};
