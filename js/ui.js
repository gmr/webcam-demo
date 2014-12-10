var ui = (function($) {

  var UI = {
    video: document.getElementById('video'),
    canvas: document.getElementById('canvas'),
    context: canvas.getContext('2d'),

    trackingColor: '#2d2f64',

    outlineColorFace: '#ffb500',
    outlineColorMouth: '#ff623d',

    colorTracker: null,
    faceTracker: null,
    mouthTracker: null,

    colorTrackingEnabled: false,
    faceTrackingEnabled: true,
    mouthTrackingEnabled: false,

    trackingEnabled: false,

    $trackingToggle: $('#toggle'),
    $toggleIcon: $('#toggle').find('i'),

    $colorTrackingToggle: $('#toggleColorTracking'),
    $colorToggleIcon: $('#toggleColorTracking').find('i'),
    $customColor: $('#customColor'),
    $colorPreviewCell: $('#previewCell'),
    $faceTrackingToggle: $('#toggleFaceTracking'),
    $faceToggleIcon: $('#toggleFaceTracking').find('i'),
    $mouthTrackingToggle: $('#toggleMouthTracking'),
    $mouthToggleIcon: $('#toggleMouthTracking').find('i')
  };

  var ui = null;

  UI.init = function() {
    this.colorTracker = this.newColorTracker(this.onTrackColor);
    this.faceTracker = this.newObjectTracker('face', 4, 1.5, 0.1, this.onTrackFace, true);
    this.mouthTracker = this.newObjectTracker('mouth', 1.5, 1.5, 0.1, this.onTrackMouth, false);

    this.trackingStart();

    this.$trackingToggle.on('click', this.onTrackingToggle);
    this.$colorTrackingToggle.on('click', this.onColorTrackingToggle);
    this.$faceTrackingToggle.on('click', this.onFaceTrackingToggle);
    this.$mouthTrackingToggle.on('click', this.onMouthTrackingToggle);

    // Enable the color picker
    var colorPicker = $('#customColor').colorpicker();
    colorPicker.on('changeColor', function(e) {
      UI.trackingColor = e.color.toHex();
      colorPicker.val(UI.trackingColor);
      UI.$colorPreviewCell.css('background-color', UI.trackingColor);
      UI.registerColor(UI.trackingColor);
      UI.clearFrame();
    });
    setInterval(function(){ UI.clearFrame(); }, 1000);
  };

  UI.clearFrame = function() {
    UI.context.clearRect(0, 0, canvas.width, canvas.height);
  };

  UI.colorTrackingStart = function() {
    if ( UI.colorTrackingEnabled === true )
    {
      UI.colorTracker.run();
      UI.$colorToggleIcon.removeClass('fa-toggle-off');
      UI.$colorToggleIcon.addClass('fa-toggle-on');
    }
  };

  UI.colorTrackingStop = function() {
    if ( UI.colorTrackingEnabled === true )
    {
      UI.colorTracker.stop();
      UI.clearFrame();
      UI.$colorToggleIcon.removeClass('fa-toggle-on');
      UI.$colorToggleIcon.addClass('fa-toggle-off');
    }
  };

  UI.faceTrackingStart = function() {
    if ( UI.faceTrackingEnabled === true )
    {
      UI.faceTracker.run();
      UI.$faceToggleIcon.removeClass('fa-toggle-off');
      UI.$faceToggleIcon.addClass('fa-toggle-on');
    }
  };

  UI.faceTrackingStop = function() {
    if ( UI.faceTrackingEnabled === true )
    {
      UI.faceTracker.stop();
      UI.clearFrame();
      UI.$faceToggleIcon.removeClass('fa-toggle-on');
      UI.$faceToggleIcon.addClass('fa-toggle-off');
    }
  };

  UI.mouthTrackingStart = function() {
    if ( UI.mouthTrackingEnabled === true )
    {
      UI.mouthTracker.run();
      UI.$mouthToggleIcon.removeClass('fa-toggle-off');
      UI.$mouthToggleIcon.addClass('fa-toggle-on');
    }
  };

  UI.mouthTrackingStop = function() {
    if ( UI.mouthTrackingEnabled === true )
    {
      UI.mouthTracker.stop();
      UI.clearFrame();
      UI.$mouthToggleIcon.removeClass('fa-toggle-on');
      UI.$mouthToggleIcon.addClass('fa-toggle-off');
    }
  };

  UI.newColorTracker = function(onTrack) {
    UI.registerColor(UI.trackingColor);
    var colorTracker = new tracking.ColorTracker('custom');
    colorTracker.on('track', onTrack);
    var tracker = tracking.track('#video', colorTracker, {camera: false});
    tracker.stop();
    return tracker;
  };

  UI.newObjectTracker = function(type, scale, stepSize, edgeDensity, onTrack, camera) {
    var objTracker = new tracking.ObjectTracker(type);
    objTracker.setInitialScale(scale);
    objTracker.setStepSize(stepSize);
    objTracker.setEdgesDensity(edgeDensity);
    objTracker.on('track', onTrack);
    var tracker = tracking.track('#video', objTracker, {camera: camera});
    tracker.stop();
    return tracker;
  };

  UI.onColorTrackingToggle = function(e) {
    if (UI.colorTrackingEnabled === false)
    {
      UI.colorTrackingEnabled = true;
      UI.colorTrackingStart();
    } else {
      UI.colorTrackingStop();
      UI.colorTrackingEnabled = false;
    }
  };

  UI.onFaceTrackingToggle = function(e) {
  if (UI.faceTrackingEnabled === false)
    {
      UI.faceTrackingEnabled = true;
      UI.faceTrackingStart();
    } else {
      UI.faceTrackingStop();
      UI.faceTrackingEnabled = false;
    }
  };

  UI.onMouthTrackingToggle = function(e) {
  if (UI.mouthTrackingEnabled === false)
    {
      UI.mouthTrackingEnabled = true;
      UI.mouthTrackingStart();
    } else {
      UI.mouthTrackingStop();
      UI.mouthTrackingEnabled = false;
    }
  };

  UI.onTrackColor = function(e) {
    if (e.data.length > 0) {
      UI.context.clearRect(0, 0, canvas.width, canvas.height);
      UI.context.strokeStyle = '#ffffff'; //UI.trackingColor;
      e.data.forEach(function(rect) {
        UI.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      });
    }
  };

  UI.onTrackFace = function(e) {
    if (e.data.length > 0) {
      UI.context.strokeStyle = UI.outlineColorFace;
      e.data.forEach(function(rect) {
        UI.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      });
    }
  };

  UI.onTrackMouth = function(e) {
    if (e.data.length > 0) {
      UI.context.strokeStyle = UI.outlineColorMouth;
      e.data.forEach(function(rect) {
        UI.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      });
    }
  };

  UI.onTrackingToggle = function(e) {
    if (UI.trackingEnabled === false)
    {
      UI.trackingStart();
    } else {
      UI.trackingStop();
    }
  };

  UI.registerColor = function(value) {
    var components = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
    var customColorR = parseInt(components[1], 16);
    var customColorG = parseInt(components[2], 16);
    var customColorB = parseInt(components[3], 16);

    var colorTotal = customColorR + customColorG + customColorB;

    if (colorTotal === 0) {
      tracking.ColorTracker.registerColor('custom', function(r, g, b) {
        return r + g + b < 10;
      });
    } else {
      var rRatio = customColorR / colorTotal;
      var gRatio = customColorG / colorTotal;

      tracking.ColorTracker.registerColor('custom', function(r, g, b) {
        var colorTotal2 = r + g + b;

        if (colorTotal2 === 0) {
          if (colorTotal < 10) {
            return true;
          }
          return false;
        }

        var rRatio2 = r / colorTotal2,
        gRatio2 = g / colorTotal2,
        deltaColorTotal = colorTotal / colorTotal2,
        deltaR = rRatio / rRatio2,
        deltaG = gRatio / gRatio2;

        return deltaColorTotal > 0.9 && deltaColorTotal < 1.1 &&
        deltaR > 0.9 && deltaR < 1.1 &&
        deltaG > 0.9 && deltaG < 1.1;
      });
    }
  };

  UI.trackingStart = function() {
    UI.$toggleIcon.removeClass('fa-toggle-off');
    UI.$toggleIcon.addClass('fa-toggle-on');
    UI.faceTrackingStart();
    UI.mouthTrackingStart();
    UI.trackingEnabled = true;
  };

  UI.trackingStop = function() {
    UI.faceTrackingStop();
    UI.mouthTrackingStop();
    UI.clearFrame();
    UI.$toggleIcon.removeClass('fa-toggle-on');
    UI.$toggleIcon.addClass('fa-toggle-off');
    UI.trackingEnabled = false;
  };

  return UI;
}(jQuery));
