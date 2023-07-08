/**
 * @category Types
 * @summary An object that combines two dates to represent the time interval.
 *
 * @description
 * An object that combines two dates to represent the time interval.
 *
 * @typedef {Object} Interval
 * @property {Date|Number} start - the start of the interval
 * @property {Date|Number} end - the end of the interval
 * @throws {RangeError} The start of an interval cannot be after its end
 * @throws {RangeError} Date in interval cannot be `Invalid Date`
 */
var Interval = {}

module.exports = Interval
ync_1.async;
    }
    return new Observable_1.Observable(function (subscriber) {
        subscriber.add(scheduler.schedule(dispatch, period, { subscriber: subscriber, counter: 0, period: period }));
        return subscriber;
    });
}
exports.interval = interval;
function dispatch(state) {
    var subscriber = state.subscriber, counter = state.counter, period = state.period;
    subscriber.next(counter);
    this.schedule({ subscriber: subscriber, counter: counter + 1, period: period }, period);
}
//# sourceMappingURL=interval.js.map