#!/bin/sh

echo "Mudando para o contexto do akspriv-awx-prd"
kubectx akspriv-awxv2-prd-admin

echo "Mudando para o namespace awx-prd"
kubens awx-prd

echo "Escalando deployment para 0..."
kubectl scale deployment bpgcb --replicas=0

echo "Aguardando 30 segundos..."
sleep 30

echo "Aplicando novo deployment..."
kubectl apply -f deployment.yml -n awx-prd
kubectl apply -f pvc.yml -n awx-prd

echo "Processo finalizado."
