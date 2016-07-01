module.exports = {
    var token = $("meta[name='csrf-token']").attr('content') || '';
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
