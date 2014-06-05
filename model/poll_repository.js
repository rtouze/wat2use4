// Poll repository to save and retrieve poll 
//

var cache = {};
var current_key = 1;

exports.save = function (poll) {
    poll.id = current_key;
    cache[current_key] = poll;
    current_key += 1;
};

exports.getById = function (id) {
    return cache[id];
};
