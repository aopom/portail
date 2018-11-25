<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRoomsReservationsTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rooms_reservations_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type', validation_max('name'))->unique();
            $table->string('name', validation_max('name'))->unique();
            $table->boolean('need_validation')->default(true);
            // Permet d'indiquer si le type doit être valider par le owner
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rooms_reservations_types');
    }
}
