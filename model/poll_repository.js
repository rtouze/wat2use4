// Poll repository to save and retrieve poll 
//

var cache = {};
var current_key = 1;

exports.save = function (poll) {
    if (poll.id < 0) {
        poll.id = current_key;
        current_key += 1;
    }
    cache[poll.id] = poll;
};

exports.getById = function (id) {
    temp = cache[id];
    return {
        id: temp.id,
        results: temp.results || {},
        timeline: temp.timeline || [],
        voteCount: temp.voteCount || 0,
        question: temp.question || 'Undifined question'
    };
};
