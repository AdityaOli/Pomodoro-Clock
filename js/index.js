
$(document).ready(function() {

  var timeToTarget = undefined;
  var deltaForTarget = undefined;
  var intervalId = undefined;
  var resetVariable = true;
  var onSession = true;
  var breakLength;

  function setupTimerDisplay() 
  {
    var config = {};
    var value = 0;
    
    if (onSession === true) 
    {
      value = $('#session-knob').val() * 60;
      $('#timer-display').val(value);
      config.max = value;
      config.fgColor = 'red';
      config.inputColor = 'red';
      config.format = function(v) 
      {
        var sec = parseInt(v);
        var min = Math.floor(sec / 60);
        sec -= min * 60;
        return min + ':' + (sec < 10 ? "0" + sec : sec);
      };
    }
    else 
    {
        var max = $('#break-knob').val() * 60;
        config.max = max;
        config.fgColor = 'green';
        config.inputColor = 'green';
        config.format = function(v) 
        {
           var sec = parseInt(v);
           sec = max - sec;
           var min = Math.floor(sec / 60);
           sec -= min * 60;
           return min + ':' + (sec < 10 ? "0" + sec : sec);
        };
    }
    
      $('#timer-display').trigger('configure', config);
      $('#timer-display').val(value);
      $('#timer-display').trigger('change');
  }
  
  if (jQuery().knob) 
  {
    $('#session-knob').knob(
    {
      'min': 0,
      'max': 220,
      'step': 1,
      'width': 200,
      'height': 200,
      'fgColor': 'black',
      'bgColor': 'white',
      
      'release': function() 
      {
        if (resetVariable) 
        {
          deltaForTarget = $('#session-knob').val() * 60000;
          setupTimerDisplay();
        }
      }
    });

    $('#break-knob').knob({
      'min': 0,
      'max': 30,
      'step': 1,
      'width': 150,
      'height': 150,
      'fgColor': 'white',
      'bgColor': 'black'
    });

    $('#timer-display').knob({
      'min': 0,
      'max': 3000,
      'width': 200,
      'height': 200,
      'rotation': 'anticlockwise',
      'fgColor': '#4EEBF0',
      'bgColor': 'black',
      'readOnly': true
    });
  }
  
  // periodic timer function
  function updateTimer() {
    var now = new Date();
    deltaForTarget = timeToTarget.getTime() - now.getTime();
    
    if (deltaForTarget > 0) {
      var sec = Math.ceil(deltaForTarget / 1000);
      if (!onSession) sec = breakLength - sec;
      $('#timer-display').val(sec);
      $('#timer-display').trigger('change');
    }
    else {
      if (onSession) {
        onSession = false;
        breakLength = $('#break-knob').val() * 60;
        deltaForTarget = breakLength * 1000;
      }
      else {
        onSession = true;
        deltaForTarget = $('#session-knob').val() * 60000;
      }
      timeToTarget = new Date(Date.now() + deltaForTarget);
      setupTimerDisplay();
    }
  }
  
  // button click events
  $('#cmd-reset').click(function() {
    deltaForTarget = $('#session-knob').val() * 60000;
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = undefined;
    }
    resetVariable = true;
    onSession = true;
    $('#cmd-pause').addClass('hidden');
    $('#cmd-go').removeClass('hidden');
    setupTimerDisplay();
    return false;
  });
  
  $('#cmd-go').click(function() {
    timeToTarget = new Date(Date.now() + deltaForTarget);
    intervalId = window.setInterval(updateTimer, 200);
    resetVariable = false;
    breakLength = $('#break-knob').val() * 60;
    $('#cmd-go').addClass('hidden');
    $('#cmd-pause').removeClass('hidden');
    return false;
  });
  
  $('#cmd-pause').click(function() {
    window.clearInterval(intervalId);
    intervalId = undefined;
    $('#cmd-pause').addClass('hidden');
    $('#cmd-go').removeClass('hidden');
    return false;
  });
  
  // initialize timer display
  deltaForTarget = $('#session-knob').val() * 60000;
  setupTimerDisplay();
});