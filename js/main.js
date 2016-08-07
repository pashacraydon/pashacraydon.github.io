 
$(document).ready(function() {

   /* Generate random color classes on body
   -------------------------------------------------------------- */
  var colors = ['blue', 'green', 'red', 'yellow'],
    rand = Math.floor(Math.random() * colors.length);
  
  $('body').addClass(colors[rand],  1);
});
