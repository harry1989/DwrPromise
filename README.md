DwrPromise
==========

DWR wrapper to support promises pattern along with callback.


<a href="http://directwebremoting.org/">DWR</a> is Java library that enables the Javascript in the browser to interact with
Java methods. It handles POJOs (Plain Old Javas Objects) on the server to be converted to JSON through a simple bean configuration.


Promises
--------

[An interface](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to acheive future tasks, it solves the various known issues with the present day asynchronous javascript. Especially <a href="http://callbackhell.com/">callback hell probelm</a>.

DWR client side code supports only callbacks now and hence it will be difficult to handle multiple DWR calls at a time. So I have written this wrapper to add the promise ability for DWR.

It uses the <a href="http://api.jquery.com/deferred.promise/">jQuery's Promise library</a>

Usage:
-----

include the dwr-promise.js script along with your dwr.js file

```
<script type="text/javascript" src="/dwr/engine.js"> </script>
<script type="text/javascript" src="/js/dwr-promise.js> </script>

<!-- DWR API fies -->
<script type="text/javascript" src="[WEBAPP]/dwr/interface/Remote.js"> </script>

```
You can covert the Remote DWR API to add promise support by doing

``` RemotePromise = DwrService.promisify(Remote)```

After this you can convert the below function to

```
Remote.getData(42, {
  callback:function(str) { 
    alert(str); 
  }
});

to

RemotePromise.getData(42).then(function(str) { 
    alert(str); 
});


errorHandler:
------------


Remote.getData(42, {
  callback:function(str) { 
    alert(str); 
  },
  errorhandler: function(error){
    alert(error);
  }
});

RemotePromise.getData(42).then(
  function(str) { 
    alert(str); 
  },
  function(error){
    alert(error);
  }
);

or 

RemotePromise.getData(42)
.done(function(str) { 
    alert(str); 
})
.fail(function(error){
    alert(error);
});


Biggest advantage is to wait till all DWR calls are succeded.

var a = RemotePromise.getData(50),
    b = RemotePromise.getData(100);

$.when(a,b).then(function(data){
   //Runs only if both a and b are fulfilled

})

```




