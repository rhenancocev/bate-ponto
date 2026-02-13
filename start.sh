#!/bin/sh

echo "Mudando para o contexto do akspriv-awx-prd"
kubectx akspriv-awx-prd-admin

echo "Mudando para o namespace awx-prd"
kubens awx-prd

echo "Escalando deployment para 0..."
kubectl scale deployment bpgcb --replicas=0

echo "Aguardando 60 segundos..."
sleep 60

echo "Aplicando novo deployment..."
kubectl apply -f deployment.yml -n awx-prd

echo "Processo finalizado."
