# bate-ponto

instalar:

PUPPETEER_PRODUCT=firefox npm install puppeteer
npm install env
npm install forever
npm install 


criar arquivo .env 

iniciar com o comando:

forever start --minUptime 1000 --spinSleepTime 1000 src/app-telegram.js

listar: forever list
parar: forever stopall
https://prweb01/bahia/gateway?hptAppId=W1A1&hptExec=Y

=======================================================

v2-config

k delete ValidatingWebhookConfiguration gatekeeper-validating-webhook-configuration

buildar a imagem do docker:
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t rhenancocev/bpgcb:2.1.9 \
  --push .


kubectl create secret generic bp-secrets \
  --from-literal=HOST=https://10.228.0.70/bahia/gateway \
  --from-literal=ID_EMPRESA=49 \
  --from-literal=MATRICULA=60012569 \
  --from-literal=SENHA=Olivia33 \
  --from-literal=CHAT_ID=621550962 \
  --from-literal=TOKEN=5729154399:AAH5wBO81je4rsPFjcJv_D98kU7m_Wb8HM4 \
  --from-literal=CONFIG_SECRET_KEY=79278e724b05a759631db730a5ee4a4b7063e686296011712701c52b111b41f8

kubectl create secret docker-registry secret-automation \                        
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=rhenancocev \
  --docker-password=dckr_pat_MjXmoUsdH9DlkmwIyAF8zOi8otQ \
  --docker-email=rhenan_cocev01@hotmail.com