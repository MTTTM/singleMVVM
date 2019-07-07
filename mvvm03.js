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
              this._data[key]=newVal;
            }
        })
    }
    //新增computed
    initComputed.call(this);
    //为什么initComputed要放在Compile前面呢，这是有讲究的
    Compile(options.el,this);

}
function initComputed(){
    let vm=this;
    let computed=this.$options.computed;
    //Object.keys {name:1,name:2}=>[name,age]
    console.log('Object.keys(computed)',Object.keys(computed))
    //为什么这里能够监听到依赖的变量变动后当前computed属性就变动呢，我这里指的的是非初始化时候的第一次获取
    //暂时没明白
    //Compile 里面有一个属于c的wather
    Object.keys(computed).forEach(function(key){
        Object.defineProperty(vm,key,{
            get:typeof computed[key]==='function'?computed[key]:computed[key].get,
            set(){
                console.warn("computed element cant't set");
            }
        })
    })
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
            //============新增地方:数据修改时候同步到dom的地方
            new Wather(vm,RegExp.$1,function(newVal){
                //这个Wather里面吧Dep的对象指向了自己
                console.log("wather",RegExp.$1)
                if(RegExp.$1=='c'){
                    console.log("c======",newVal)
                }
                node.textContent=text.replace(reg,newVal);
            })
            node.textContent=text.replace(reg,val);

        }
        //双向数据绑定 例如input===新增===【
        if(node.nodeType===1){
             let nodeType=node.attributes;
             //console.log("nodeType",nodeType,node);
             Array.from(nodeType).forEach(function(attr){
                let name=attr.name;
                let exp=attr.value;
                if(name.indexOf("v-")==0){
                    node.value=vm[exp];
                }
                new Wather(vm,exp,function(newVal){
                    node.value=newVal;
                })
                node.addEventListener("input",function(e){
                    let newV=e.target.value;
                    vm[exp]=newV;
                })
             })
        }
        //====================]
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
    //新增====就一个发布器
    let dep=new Dep();
 for(let key in data){
     let val=data[key];
    //通过data属性object.defineProperty的方式定义属性
    observe(val);
    Object.defineProperty(data,key,{
        enumerable:true,
        get(){
            //====新增 
            Dep.target&&dep.addSub(Dep.target);
            console.log("get",dep)
            return val;
        },
        set(newVal){
            console.log("修改")
            //更改值得时候,如果同样，不做处理
            if(newVal===val){
                return;
            }
            
            val=newVal;
            //防止赋值一个对象
            observe(newVal);
            dep.notify();//让所有watcher的 update函数执行
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

