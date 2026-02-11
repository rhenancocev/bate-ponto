vazamento = true
hacker = true
function vazamentodeDados(){
  if (vazamento){
    for (var i = 0; i<100; i++){
      console.log('foi um hacker')
    }
    //return 'foi um hacker'
  }
  else if (vazamento && hacker){
    console.log('o vazamento nao tem tanta importancia')
    return 'o vazamento nao tem tanta importancia'    
  }
  else if (vazamento && hacker && importancia == null){
    return 'O que que ce faz?'
  }
}

vazamentodeDados();