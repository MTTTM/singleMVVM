//发布订阅模式
 //先有订阅，后有发布[fn1,fn2,fn3]
 //发布就是便利之前的订阅函数
 function Dep(){
     this.subs=[];
 }
 //订阅
 Dep.prototype.addSub=function(){
    this.subs.push(sub);
 };
 Dep.prototype.notify=function(){
    this.subs.forEach(sub=>sub());
 };

 //监听者,其实他就是发布数组里面的函数
 function Wather(fn){
     this.fn=fn;
 }
 Wather.prototype.update=function(){
    this.fn();
 };