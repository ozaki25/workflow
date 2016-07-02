var Backbone = require('backbone');

module.exports = function() {
    var token = Backbone.$("meta[name='csrf-token']").attr('content') || '';
    var originalSync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
        if(method !== 'fetch') {
            options.beforeSend = function(xhr) {
                xhr.setRequestHeader('X-CSRF-TOKEN', token);
            };
        }
        return originalSync(method, model, options);
    };
}
