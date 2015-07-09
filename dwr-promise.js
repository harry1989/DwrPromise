/**
 * dwr-promise.js
 * 
 * A wrapper on DWR to support to Promises
 *
 * @depends jQuery 
 *
 * @author: muralish
 *
 */


DwrService = (function(){
	
	/**
	 * This methods converts all the
	 * functions of the API tp be asynchronus 
	 * and returns a Promise object  
	 * 
	 */
	var promisify = function(API){
		$.each(API, function(key){
			if(typeof(API[key]) !== 'function'){
				return;
			}
			var old_method = API[key];
			
			/**
			 * New method which interacts with
			 * the DWR in async way and provide a
			 * promise interface
			 */
			var new_method = function(){
				
				var args = [].slice.call(arguments);
				var usePromise = true;
				var userCbFn;
				var errorHandler;
				var defer; 
				
				/**
				 * Function that will be called by
				 * DWR engine once the response is
				 * received
				 */
				var callbackWrap = function(data){
					/**
					 * Callback function is provided by user,
					 * so call this 
					 */
					if(userCbFn){
						userCbFn.call(null, data);
					}
					/**
					 * Resolve the promise 
					 */
					else if(usePromise && defer){
						defer.resolve(data);
					}
				};
				
				var erroCb = function(data){
					if(errorHandler){
						errorHandler.call(null, data);
					}
					/**
					 * Resolve the promise 
					 */
					else if(usePromise && defer){
						defer.reject(data);
					}
				};
				
				/**
				 * Always use the async as true
				 */
				var async_cb_object = {
					async: true,
					callback: callbackWrap,
					errorHandler: errorCb
				};
				
				/**
				 * Check if the latest argument is a function,
				 * If so call this after the promise is fulfilled
				 */
				if(args.length > 0 ){
					var last_arg = args[args.length - 1];
					var callback = last_arg['callback'];
					if (typeof(last_arg) === 'function'){
						usePromise = false;
						userCbFn = last_arg;
						args[args.length - 1] = async_cb_object;
					}
					
					/**
					 * Sometimes last argument can be an object having
					 * async and callback functions.
					 */
					else if (typeof(last_arg) === 'object' && callback && typeof(callback) === 'function' ){

						usePromise = false;
						userCbFn = callback;
						args[args.length - 1] = $.extend({}, last_arg, async_cb_object);
						
						var errorCb = last_arg['errorHandler'];
						if (errorCb && typeof(errorCb) === 'function'){
							errorHandler = errorCb;
						}
					}
					/**
					 * No callback is mentioned, so append the async object
					 */
					else {
						args[args.length] = async_cb_object;
					}
					
				}
				else {
					args[args.length] = async_cb_object;
				}
				
				/**
				 * If the last argument is not a function,
				 * Create a promise and return that
				 */
				old_method.apply(old_method, args);
				
				/**
				 * Return the promise object if called without
				 * callback
				 */
				if(usePromise){
					defer = new $.Deferred();
					return defer.promise();
				}
			};
			
			API[key] = new_method;
		});
		
		return API;
	};

	return {
		promisify: promisify 
	}
	
})();

