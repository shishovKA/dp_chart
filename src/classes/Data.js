var Data = /** @class */ (function () {
    function Data() {
        this.seriesStorage = [];
    }
    Data.prototype.findExtremes = function (type, from, to) {
        var maxArr = [];
        var minArr = [];
        this.seriesStorage.forEach(function (series) {
            var dataRange;
            if ((from !== undefined) && (to !== undefined)) {
                dataRange = series.getDataRange(type, from, to);
            }
            else {
                dataRange = series.seriesData;
            }
            var extremes = series.findExtremes(dataRange);
            switch (type) {
                case 'ind':
                    minArr.push(extremes[2]);
                    maxArr.push(extremes[3]);
                    break;
                case 'val':
                    minArr.push(extremes[0]);
                    maxArr.push(extremes[1]);
                    break;
            }
        });
        return [Math.min.apply(Math, minArr), Math.max.apply(Math, maxArr)];
    };
    Data.prototype.findSeriesById = function (id) {
        var series = this.seriesStorage.filter(function (series) {
            return series.id === id;
        });
        if (series.length !== 0)
            return series[0];
        return null;
    };
    Data.prototype.switchAllSeriesAnimation = function (hasAnimation, duration) {
        this.seriesStorage.forEach(function (series, ind) {
            series.hasAnimation = hasAnimation;
            if (duration)
                series.animationDuration = duration;
        });
    };
    Data.prototype.changeAllSeriesAnimationTimeFunction = function (newTimeFunc) {
        this.seriesStorage.forEach(function (series, ind) {
            series.timeFunc = newTimeFunc;
        });
    };
    return Data;
}());
export { Data };
