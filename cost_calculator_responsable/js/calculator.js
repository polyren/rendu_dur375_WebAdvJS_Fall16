// ==============================
// rendu 2016
// ==============================
// instruction：
// first,click the program you want. Then check the estimate costs and time costs inthe downleft bar. After that,
// If you have your own plan, like require me to finish those faster than the estimate time, you can insert the days
// diractly into the rightdown bar, then you can get a budget of how much it will costs(must be expensive if you want
// to be quick). You can also insert your budegt and it will show how long it will take.

// becareful:
// you can not do calcuation before you select any of the program, because the result has relations with program vales.
// ==============================

$(document).ready(function () {

var total=0;
var hours=0;
var days=0;
var watermark1 = 'insert your budget here';
var watermark2 = 'insert your time plan here';

    $('.list').on('click',function(){
      $(this).toggleClass('media-clicked');
      if(!$(this).hasClass('active')){
        total += Number($(this).attr("value"));
        $(this).addClass('active');

    } else {
        total -= Number($(this).attr("value"));
        $(this).removeClass('active');
    }
    hours = total*2/125;
    days= Math.ceil(hours/8);
    $("input[name=value_sum]").val(total+" RMB");
    $("input[name=time_sum]").val(days+" days");
    });

    $('.plan_price_num').val(watermark1).addClass('watermark');
    $('.plan_time_number').val(watermark2).addClass('watermark');

    $('.plan_price_num').blur(function(){
        if ($(this).val().length == 0){
            $(this).val(watermark1).addClass('watermark');
        }
    });

    $('.plan_price_num').focus(function(){
        if ($(this).val() == watermark1){
            $(this).val('').removeClass('watermark');
        }
    });

    $('.plan_time_number').blur(function(){
        if ($(this).val().length == 0){
            $(this).val(watermark2).addClass('watermark');
        }
    });

    $('.plan_time_number').focus(function(){
        if ($(this).val() == watermark2){
            $(this).val('').removeClass('watermark');
        }
    });

    $('#a1').keyup(function(){
    var planmony = $(this).val();
    var calhours = (total/planmony)*hours; 
    var caldays = Math.ceil(calhours/8);
    $('#a2').val(caldays + ' days');
    });

    $('#a2').keyup(function(){
    var plantime = $(this).val();
    var plantimehours=plantime*8;
    var calmony = (total*hours/plantimehours); 
    $('#a1').val(calmony + ' RMB');
    });

    $('button.title_logo').click(function(){
        $('ul.logo').toggle()
    });

    $('button.title_font').click(function(){
        $('ul.font').toggle()
    });
    $('button.title_color').click(function(){
        $('ul.color').toggle()
    });
    $('button.title_graphic').click(function(){
        $('ul.graphic').toggle()
    });

})
   

