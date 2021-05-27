> 基于Vue的多页面脚手架，适用于访问量较大、并且对seo需求较高的项目

## 开发
拷贝page目录下的文件夹，更改文件夹、html、js文件名 例如:  

-- demo 

    -- demo.html
      
    -- demo.js  
     
启动项目，访问 localhost:8080/demo.html

### 注意: 移动端适配基于lib-flexible,其原理是动态设置 meta name="viewport"的标签，因此需要检查一下html文件的head中，如果有 meta name="viewport"标签，需要将他注释掉，因为如果有这个标签的话，lib-flexible就会默认使用这个标签。而我们要使用lib-flexible自己生成的 meta name="viewport"来达到高清适配的效果。
                  
                                           