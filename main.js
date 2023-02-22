const getInBtw= document.getElementsByClassName("playbutton");
const greetPopUp=document.querySelectorAll(".delete")
const nums=['2','3','4','5','6','7','8','9','10','jack','king','queen','1'];
const symbols=['clover', 'heart','diamond', 'spade'];
const port= document.querySelector('.portrait');
const jackEmotion=document.querySelector('#jack');
const cardsPlace= document.querySelector('ul');
const money= document.querySelector('#money');
const scoreMe= document.querySelector('#scoreMe');
const scoreOfDealer=document.querySelector("#scoreDealer");
 
port.style.display='none';
scoreOfDealer.style.display="none";

const blackJack={
    deck:[],
    renewDeck(){
        this.deck=[];
       for(let symbol of symbols){
        for(let num of nums)
            this.deck.push({    
                symbol,
                num,
                link:`images/images_cards/${symbol}/${symbol}_${num}.png`
            });
       }
    },
    user:{
        money:15000,
        score:0,
        moneyBetOntheGame:0,

        myCardsStatuses:[
            {
            card:document.querySelector("#first_one"),
            isDrawed:false, 
            symbol:null,
            num:null,
        },
        {
            card: document.querySelector("#second_one"),
            isDrawed:false,
            symbol:null,
            num:null,

        },
        {
            card: document.querySelector("#third_one"),
            isDrawed:false,
            symbol:null,
            num:null,
            
            },
        {
            card:document.querySelector("#fourth_one"),
            isDrawed:false,
            symbol:null,
            num:null,

        },
        {
            card: document.querySelector("#fifth_one"),
            isDrawed:false,
            symbol:null,
            num:null,

            },
        {
            card:document.querySelector("#sixth_one"),
            isDrawed:false,
            symbol:null,
            num:null,
        }
        ]
    },
    dealer:{
        score:0,        
        myCardsStatuses:[
            {
            card:document.querySelector("#first_one_De"),
            isDrawed:false, 
            symbol:null,
            num:null,
        },
        {
            card: document.querySelector("#second_one_De"),
            isDrawed:false,
            symbol:null,
            num:null,
            link:null
            //to remember which card was flipped
        },
        {
            card: document.querySelector("#third_one_De"),
            isDrawed:false,
            symbol:null,
            num:null,

            },
        {
            card:document.querySelector("#fourth_one_De"),
            isDrawed:false,
            symbol:null,
            num:null,

        },
        {
            card: document.querySelector("#fifth_one_De"),
            isDrawed:false,
            symbol:null,
            num:null,

            },
        {
            card:document.querySelector("#sixth_one_De"),
            isDrawed:false,
            symbol:null,
            num:null,
        }
        ]

    },
   
    putCardsDown(objs){
        for(let obj of objs){
            obj.symbol=null;
            obj.isDrawed=false;
            obj.num=null;
            
            
            obj.card.style.display='none';
        }
    },

    scoreRenew(number, whosScore){
    if(Number(number)){
        whosScore.score+= Number(number);}
    else{
            whosScore.score+= 10;
        }
    if(whosScore===blackJack.user)
        scoreMe.innerHTML= whosScore.score;
    else if(whosScore===blackJack.dealer &&(number>=17))
        scoreOfDealer.innerHTML=whosScore.score;
    
    console.log(whosScore.score);
        
    },

    gameStart(){
        blackJack.openCard(blackJack.user);
        
        setTimeout(function(){blackJack.openCard(blackJack.dealer)},750
        );
       
        setTimeout(function(){blackJack.openCard(blackJack.user)},1500
        );
        const promise1 = new Promise((resolve, reject)=>{
            setTimeout(function(){
                blackJack.openCard(blackJack.dealer);
                blackJack.dealer.myCardsStatuses[1].card.src="images/images_cards/cardback_0.png"
                resolve()
        
        },2250);
    });

      
    promise1.then(()=>{
        createBtn("hit!", "hithit");
        createBtn("stay.", "staystay"); 
        const hitBtn= document.querySelector(".hithit");
        const stayBtn= document.querySelector(".staystay");

        
        hitBtn.addEventListener("click", function(){
            blackJack.openCard(blackJack.user);
            if(blackJack.ifBust(blackJack.user)){
            removeElement(document.querySelectorAll(".hithit"));
            removeElement(document.querySelectorAll(".staystay"));
            
                setTimeout(function(){
                    blackJack.youLoseOrWin("Score shouldn't exceeds 21!",false);
                    
            },500);
            };
        });
    
        stayBtn.addEventListener("click", function(){
            removeElement(document.querySelectorAll(".hithit"));
            removeElement(document.querySelectorAll(".staystay"));
            blackJack.dealer.myCardsStatuses[1].card.src=`${blackJack.dealer.myCardsStatuses[1].link}`;
           
        
        const ifUnder17=()=>{
            setTimeout(function(){
                if(blackJack.dealer.score<17){
                    ifUnder17();
                    blackJack.openCard(blackJack.dealer)
                    console.log(blackJack.dealer.score)
                }   
                else blackJack.dealerAlgorithm();
            },750)
        }
        
    ifUnder17();
        

    })
    })
},
  
    youLoseOrWin(howCome,WOrL){
        const popUp= document.createElement("div");
        popUp.classList.add("greetLetter","lose");
        createBtn("What are you waiting for!", "startGame");
        blackJack.user.score=0;
        blackJack.dealer.score=0;
        console.log(blackJack.user.moneyBet)

        if(WOrL){
            popUp.insertAdjacentHTML("beforeend", `<p>${howCome}<br>You Win!</p>`)
            popUp.insertAdjacentHTML("beforeend", "<img src='images/jack_pretty_rich.webp'>")
            document.body.appendChild(popUp);
             blackJack.moneyCalculateWin(false, blackJack.user.moneyBetOntheGame);
            isJackRich();
            
        }else{
            popUp.insertAdjacentHTML("beforeend", `<p>${howCome}<br>You Lose!</p>`)
            popUp.insertAdjacentHTML("beforeend", "<img src='images/jack_deep_mind.avif'>")
            document.body.appendChild(popUp);
            blackJack.moneyCalculateWin(false, 0);
            isJackRich();
         
        }

        setTimeout(function(){
            removeElement(document.querySelectorAll(".greetLetter")),
            blackJack.putCardsDown(blackJack.user.myCardsStatuses);
            blackJack.putCardsDown(blackJack.dealer.myCardsStatuses);},3000);

    },

    compare(uScore,dScore){
        if(uScore>dScore){
            return true;
        }
        return false;
    },

    dealerAlgorithm(){
        if(blackJack.ifBust(blackJack.dealer)){
                this.youLoseOrWin("Congratulation!", true);
        }else{
            if(this.compare(this.user.score,this.dealer.score)){
                this.youLoseOrWin("Congratulation!", true);
            }else{
                this.youLoseOrWin("he's number is closer than yours", false);
            }
        }
    },

    ifBust(whos){
        if(whos.score>21){
            return true;
        }
        return false;
    },

    openCard(whosCard){
        //매개인자로 user번호 혹은 dealer인지 전달
        const cardOnHand= whosCard.myCardsStatuses;
        const emptyCard=cardOnHand.find(element=>element.isDrawed===false);
        //퍠 정보
        const cardinfo=this.drawcard()[0];
        //뽑은 카드 정보
        emptyCard.num=cardinfo.num;
        emptyCard.symbol=cardinfo.symbol;
        emptyCard.card.src= cardinfo.link;
        emptyCard.link= cardinfo.link;

        console.log(emptyCard);
        this.scoreRenew(emptyCard.num,whosCard);
        //스코어 갱신
        
        hideUntill(emptyCard.card);
        //덮혀있는 카드를 뒤집고, 해당 객체에 정보 씌우기
        emptyCard.isDrawed=true;
    },

    drawcard(){
        const idx= Math.floor(Math.random()*this.deck.length)-1;
        
        returnValue= this.deck.splice(idx,1);
        return returnValue;
    }
    ,
    moneyCalculateWin(DoubleDown,moneyBet){
            if(DoubleDown){
                //willbeadded
            }
            else{
                moneyBet=Number(moneyBet)*2;
                blackJack.user.money+=moneyBet;
                blackJack.user.moneyBetOntheGame=0;
                console.log(moneyBet);
                blackJack.renewMoney();

            }


    },
    renewMoney(){
            const moneyIHave=document.querySelector("#money");
            moneyIHave.innerHTML=blackJack.user.money;
    },

    startAlleL(){
        
        document.querySelector(".startGame").addEventListener("click", function(){
            const popUp=document.createElement("div");
            removeElement(document.querySelectorAll(".startGame"));

        
            //잔고 갱신하는 함수
            popUp.classList.add("askHowMuch","greetLetter");
            popUp.insertAdjacentHTML("beforeend", "<h1 class='bettingUlma'>얼마를 베팅하시겠습니까??</h1>");
            popUp.insertAdjacentHTML("beforeend" , `<input id='howMuch' type='text' value=${blackJack.user.money}>`);
            popUp.insertAdjacentHTML("beforeend", "<button id='howMuchBtn'>누르세요</button>");    
            document.body.appendChild(popUp);
            //베팅 창 띄우기

            blackJack.user.moneyBetOntheGame=document.querySelector("#howMuchBtn").addEventListener("click",function(){
                const moneyUserWantsToBet= Number(document.querySelector("#howMuch").value);
                    if(moneyUserWantsToBet){
                        if(moneyUserWantsToBet>blackJack.user.money){
                            document.body.querySelector(".bettingUlma").innerHTML="I know you don't have that much money.";
                         }
                        else{

                            blackJack.user.money-=moneyUserWantsToBet;
                            blackJack.user.moneyBetOntheGame=moneyUserWantsToBet;
                            blackJack.renewMoney();
                            
                            removeElement(document.querySelectorAll(".askHowMuch"));
                            blackJack.gameStart();
                        
                            return moneyUserWantsToBet;
                        };}
                    else{
                        document.body.querySelector(".bettingUlma").innerHTML="말이 아니라 돈을 주세요";
               };
            //베팅 금액 받는함수
        })})
        
    
     // 게임시작 버튼
    }
    
    
};

const createBtn=(saying, className)=>{
    const newEl= document.createElement('button');
    newEl.classList.add(className);
    const newElText=document.createTextNode(saying);
    newEl.appendChild(newElText);
    document.body.appendChild(newEl);
//버튼 만들기


    if(className==="startGame"){
        blackJack.renewMoney();
        blackJack.startAlleL();
        
    }

};

blackJack.putCardsDown(blackJack.user.myCardsStatuses);
blackJack.putCardsDown(blackJack.dealer.myCardsStatuses);

//사전에 오브젝트들을 숨겨놓음(필요할때 뒤집음);

getInBtw[0].addEventListener("click", function(){
    removeElement(greetPopUp);
    
    const nickName= document.querySelector(".greetLetter");
    nickName.setAttribute("class","delete greetLetter");

    const nameGetter={
        1:"<p class='headLetter'>What\'s Your name pal?<p>",
        2:"<input type='text' id='nameArea' name='name' class='submitName' value='TaekYoung'></input>",
        3:"<input type='submit' value='enter' class='submitName' id='putName'></input>" 
    };

    valuesOfNameGetter=Object.values(nameGetter);
    for(let valueOfNameGetter of valuesOfNameGetter){
        nickName.insertAdjacentHTML("beforeend",valueOfNameGetter);
    };

    
    document.querySelector("#putName").addEventListener("click", function(){
        const valueOfTextarea=document.querySelector("#nameArea").value;
        const changeName= document.querySelector("#firstName")
        
        changeName.innerHTML=`Jack ${valueOfTextarea}`;
        blackJack.renewDeck();

        createBtn("What are you waiting for!", "startGame");    
        //시작버튼
        hideUntill(port);
        hideUntill(scoreOfDealer);
        removeElement(document.querySelectorAll(".delete"));
})
});
//이름 입략




const removeElement= (elements)=>{
    elements.forEach(element => {
         element.remove();
            
    });
}//should return by array based elements such like queryselectorall.

const hideUntill=(element)=>{
    element.style.display='block';
};
//안보이던 요소를 다시 보이게 할때, 이전에 obj.style.display="none" 먼저 선언할것

hitJack=jackEmotion.addEventListener("click", function hitJa(){
    jackState.hittingJack();
});
const isJackRich=()=>{
    if(blackJack.user.money<1000){
        jackState.jackNotHappyAnymore();
    }
    else if(blackJack.user.money<=15000){
        jackState.jackNormal();
        // jackState.clicktime=0;
        
        //잭을 괴롭히지 마세요
    }

    else
        jackState.fancyAssJack();
        jackState.clicktime=0;

   
        
}


const jackState={
    clicktime:0,
    changeJack(linkAdrress){
        jackEmotion.src=`${linkAdrress}`;
    },

    hittingJack(){
        this.clicktime++;
        if (this.clicktime>=3 && this.clicktime<5){
        this.changeJack("images/jack_why.avif");
        }
        else if(this.clicktime>=5 && this.clicktime<=7){
            this.changeJack("images/jack_scared.jfif");
        }else if(this.clicktime>=8){
            jackEmotion.style.display="none";
            alert("Jack ran away!! Do not scare him")
        };

    },
    jackNormal(){
        this.changeJack("images/jack_ok.avif");
    },
    jackNotHappyAnymore(){
        this.changeJack("images/jack_broke.webp");
    },
    jackBecamePrettyFancy(){
        this.changeJack("images/jack_pretty_rich.webp");
    },
    fancyAssJack(){
        this.changeJack("images/richAssJack.jpg");
    }
};
//초상화의 표정변화, (잭의 초상화를 일정이상 클릭하면 도망감)