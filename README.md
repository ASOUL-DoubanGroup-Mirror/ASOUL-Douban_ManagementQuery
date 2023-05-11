## 豆瓣魂组-管理公示记录网站源码

### 说明

本仓库为[豆瓣魂组管理公示记录（2023年5月前）查询网站](http://mc.otterdaily.cn:1211)的源码仓库。该网站设计初衷为方便后来管理与组员查询魂组历史管理处理记录——“不错杀一个好人，不放过一个坏人”，大抵如是也。



不过因为个人心力问题，该网站依然很潦草。基本上套用的是发言查询记录网站的粗糙模板。不过能用就行。应该平常也没人用吧（笑）。



本项目也是本人为ASOUL社群贡献的最后一舞。希望魂组在未来能成为一个爱比恨多、供纯良粉丝待的好环境，能够陪着剩下的四个姑娘继续慢慢走下去。就像是2022年5月10号前的魂组那样。



我个人部署的网站会开至2024年1月，截至本人部署云服务器到期为之。本文档将说明如何使用这一部分源码完成部署。

### 环境准备及需求

- Nodejs Version>=16.15
- sqlite interface support (在大多数设备上都是支持的，通常不需要担忧这一点)
- 运行内存大于10MB

### 部署步骤

首先，clone源码到您的设备上：

`https://github.com/ASOUL-DoubanGroup-Mirror/ASoul-Douban-2023-QuryComments.git`

当然，您也可以直接点击[这个链接](https://github.com/ASOUL-DoubanGroup-Mirror/ASoul-Douban-2023-QuryComments/archive/refs/heads/main.zip)下载源码。

而后，在源码clone的根目录（或是压缩包解压出来的目录）下，在您的终端里运行

`npm install`

完成必要的依赖安装。

而后，您要前往豆瓣魂组数据仓库，下载相应的公开管理数据：

https://github.com/ASOUL-DoubanGroup-Mirror/Data/releases/tag/2023-05-02-Management

下载完毕后，将数据`ASOUL_DOUBAN_MANAGER_2023-5-2.db`文件放至根目录下。

由于设计上采用的是前后端分离的设计，因此在完成这些步骤后，您还需要进行一些修改。

首先，请确定您要开放的端口号，然后至`./index.js`中，修改端口号代码：

```javascript
const port = 1211 //port you want
```

而后前往修改根目录下的`./frontend/config.js`文件。若您想要外部能够访问该网页，您也要修改`config.js`代码中的地址为您的部署服务器的地址：

```
window._TEST_SERVER = "http://your_host and port"
```

即：若我想在一个公网ip`127.12.3.1`的服务器上，于端口`3001`部署本应用，我应该首先修改`index.js`:

```
const port = 3001
```

而后修改`config.js`:

```
window._TEST_SERVER = "http://127.12.3.1:3001"
```

之后运行

```
node index.js
```

便能看到您的服务器部署完毕了。