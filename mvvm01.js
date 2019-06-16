function Zhufeng(options={}){
    this.$options=options;//将所有竖向挂着在￥options
    var data=this._data=this.$options.data;
    observe(data);//添加监听
    //把data的属性给当前对象添加，这样就可以通过this访问
    for(let key in data){
        Object.defineProperty(this,key,{
            enumerable:true,
            get(){
                return this._data[key];
            },
            set(newVal){
              
            }
        })
    }
    Compile(options.el,this);

}
//vm.$options
//编译器
function Compile(el,vm){
  //el表示替换的范围,和vm关联，方便后面调用
  vm.$el= document.querySelector(el);
  let fragment=document.createDocumentFragment();
  //通过文本碎片把真实dom转入内存,真实的dom就在页面看不到了
  while(child=vm.$el.firstChild){
      fragment.appendChild(child);
  }
  replace(fragment);
  function replace(fragment){
    Array.from(fragment.childNodes).forEach(function(node){
        //循环每一层
        let text=node.textContent;
        let reg=/\{\{(.*)\}\}/;
        //字符串类型
        if(node.nodeType===3&&reg.test(text)){
            console.log(RegExp.$1);
            let arr=RegExp.$1.split(".");
            let val=vm;
            //遍历匹配data的数据例如 a.a.a,一层一层的往下获取
            arr.forEach(function(k){
                //第一次之后读取val而不是vm,这样才能确保data能一层层的获取
                val=val[k];
            })
            node.textContent=text.replace(reg,val);

        }
        console.log("node.childNodes",node.childNodes)
        //如果是节点对象，不断的递归,node的childNodes是一个类数组
        if(node.childNodes){
            replace(node);
        }
      });
  }

  //再通过文本碎片放回真实ROOT DOM
  vm.$el.appendChild(fragment);

};





//观察对象给对象正价Object.DefineProperty
function Observe(data){
 for(let key in data){
     let val=data[key];
    //通过data属性object.defineProperty的方式定义属性
  
    observe(val);
    Object.defineProperty(data,key,{
        enumerable:true,
        get(){
            return val;
        },
        set(newVal){
            //更改值得时候,如果同样，不做处理
            if(newVal===val){
                return;
            }
            val=newVal;
        }
    })
 }
}
//给对象类型的创建监听对象
function observe(data){
    //如果不是对象的时候不需要监听,英文Object.definePrototy是对象的属性，不是常亮或者数值类型的属性
    //而且数值类型本来监听就是通过他父级的对象提供的监听
    if(typeof data!=='object'){
        return;
    }
    return new Observe(data);
}   






 