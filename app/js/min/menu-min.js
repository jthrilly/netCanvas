var $=require("jquery"),Menu=function n(e){function t(n,e){for(var t in e)e.hasOwnProperty(t)&&(n[t]=e[t]);return n}var o={},i=[],s=!1,a=$(".menu-container"),r=!1,u=function(){o.closeMenu()};return o.options={onBeforeOpen:function(){$(".menu-btn").transition({opacity:0}),$(".menu-btn").hide(),$(".black").hide(),$(".arrow-next").transition({marginRight:-550},1e3),$(".arrow-prev").transition({marginLeft:-550},1e3),$(".content").addClass("pushed"),$(".pushed").on("click",u)},onAfterOpen:function(){return!1},onBeforeClose:function(){$(".pushed").off("click",u),$(".content").removeClass("pushed")},onAfterClose:function(){$(".black").show(),$(".arrow-next").transition({marginRight:0},1e3),$(".arrow-prev").transition({marginLeft:0},1e3)}},o.getMenus=function(){return i},o.closeMenu=function(n){n?n.items.find(".icon-close").trigger("click"):$.each(i,function(n){var e="."+i[n].name+"-menu-container";$(e).hasClass("active")&&i[n].items.find(".icon-close").trigger("click")})},o.toggle=function(n){var e=n.button[0].getBoundingClientRect(),t=$("."+n.name+"-menu"),i=$("."+n.name+"-menu-container");if(t.addClass("no-transition"),t[0].style.left="auto",t[0].style.top="auto",s===!0)return!1;if(s=!0,n.expanded===!0)o.options.onBeforeClose(),i.removeClass("active"),setTimeout(o.options.onAfterClose,1e3),s=!1;else{o.options.onBeforeOpen();var a=modifyColor($("."+n.name+"-menu").css("background-color"),-.2);$("body").css({"background-color":a}),i.addClass("active"),setTimeout(o.options.onAfterOpen,500),s=!1}setTimeout(function(){t[0].style.left=e.left+"px",t[0].style.top=e.top+"px",n.expanded===!0?(t.removeClass("no-transition"),i.removeClass("menu-open"),n.expanded=!1,$(".menu-btn").transition({opacity:1})):setTimeout(function(){t.removeClass("no-transition"),i.addClass("menu-open"),n.expanded=!0},25)},25)},o.addMenu=function(n,e){var t={};t.name=n,t.expanded=!1,t.button=$('<span class="hi-icon menu-btn '+n+'" style="opacity:0"></span>'),t.button.addClass(e).html(n),a.append(t.button),t.button.css({top:-300});var s=n+"-menu",u=n+"-menu-container";return t.items=$('<div class="morph-button morph-button-sidebar morph-button-fixed '+u+'"><div class="morph-content '+s+'"><div><div class="content-style-sidebar"><span class="icon icon-close">Close the overlay</span><h2>'+n+"</h2><ul></ul></div></div></div></div>"),t.button.after(t.items),t.button.on("click",function(){o.toggle(t)}),t.items.find(".icon-close").on("click",function(){$(".menu-btn").show(),o.toggle(t)}),i.push(t),r===!0?setTimeout(function(){t.button.transition({top:0,opacity:1},1e3).promise().done(function(){r=!1})},500):(r=!0,t.button.transition({top:0,opacity:1},1e3).promise().done(function(){r=!1})),t},o.removeMenu=function(n){n.button.transition({top:-300,opacity:0},1e3,function(){$(n.button).remove(),$(n.items).remove()})},o.addItem=function(n,e,t,i){var s=$('<li><a class="icon icon-server '+t+'" href="#">'+e+"</a></li>");n.items.find("ul").append(s),s.on("click",function(){$(".paginate").removeAttr("disabled"),o.closeMenu(n),setTimeout(function(){i()},500)})},o.init=function(){global.tools.notify("Menu initialising.",1),global.tools.extend(o.options,e)},o.init(),o};module.exports=new Menu;