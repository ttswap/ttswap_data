# ttswap_data

## Install

```sh
npm i
```

## Usage

```sh
# start dev server
npm run serve
```
## 全局 pm2: 持久化

```sh
npm install -g pm2

pm2 list

#进入项目根目录 cd /**/ttswap_data
pm2 delete ttswap_data

pm2 start "npm run serve" --name ttswap_data

pm2 stop ttswap_data

```