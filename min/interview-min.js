var Interview=function n(){var n={},t=0,e=$("#content");return n.id=0,n.date=new Date,n.stages=2,n.init=function(){n.goToStage(0),$(".arrow-next").click(function(){n.nextStage()}),$(".arrow-prev").click(function(){n.prevStage()})},n.loadData=function(t){var e=JSON.parse(t);$.extend(n,e)},n.goToStage=function(n){var a=n;e.transition({opacity:"0"},700,"easeInSine").promise().done(function(){e.load("stages/"+n+".html",function(){e.transition({opacity:"1"},700,"easeInSine")})}),t=a},n.nextStage=function(){n.goToStage(t+1)},n.prevStage=function(){n.goToStage(t-1)},n};