angular.module("Prometheus.services").factory('YAxisUtilities', [function() {
  var logScale, linearScale;
  // Extends a D3 scale to ignore "null" values.
  function extendScale(scale) {
    var extendedScale = function(y) {
      if (y === null) {
        return null;
      }
      return scale(y);
    }
    extendedScale.__proto__ = scale;
    return extendedScale;
  }
  return {
    setLogScale: function(min, max) {
      return logScale = extendScale(d3.scale.log().domain([min, max]));
    },
    setLinearScale: function(min, max) {
      if (!logScale) {
        throw("Must set logScale first!");
      }
      return linearScale = extendScale(d3.scale.linear().domain([min, max]).range(logScale.range()));
    },
    getScale: function(scale) {
      return scale === "log" ? logScale : linearScale;
    },
    getTickFormat: function(format) {
      return format === "kmbt" ? Rickshaw.Fixtures.Number.formatKMBT : null;
    },
    checkValidNumber: function(event) {
      var el = event.currentTarget;
      var inputSplit = el.value.split("=");
      var maybeCond = inputSplit[0];
      var maybeValue = parseFloat(maybeCond, 10);
      var val = parseFloat(inputSplit[1], 10);
      if (maybeCond && isNaN(maybeValue) && ([">", "<"].indexOf(maybeCond) === -1 || isNaN(val))) {
        el.classList.add("invalid_input");
      } else {
        el.classList.remove("invalid_input");
      }
    },
    disableYMaxSibling: function(event) {
      var $yMaxInputs = $(event.currentTarget).closest(".widget_wrapper").find("[ng-model='axis.yMax']");
      $yMaxInputs.prop('disabled', false);
      if (!event.currentTarget.value) {
        return;
      }
      var inputs = Array.prototype.slice.call($yMaxInputs);
      var i = inputs.indexOf(event.currentTarget);
      inputs.splice(i, 1);
      $(inputs).prop('disabled', true);
    }
  };
}]);
