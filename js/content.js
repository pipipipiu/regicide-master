var drawPile = [];
var drawPileNum = 0;

var discardPile = [];
var discardPileNum = 0;

var enemyPile = [];
var enemyPileNum = 0;

var hand = [];
var handNum = 0;
var maxHandNum = 0;

var specialPile = [];
var specialPileNum = 0;
var specialPileState = false;

var selectedCards = [];
var selectedCardPoint = 0;
var selectedCardEffects = [0, 0, 0, 0, 0];
var selectedLegal = true;

var playerNumber = 1;

var enemyPoint = 0;
var enemyAttack = 0;
var enemyHeart = 0;
var enemyPower = 0;
var enemyFriendly = 0;
var iconVis = [0, 0];

var enemyInfoVis = [0, 0, 0];

var win = 0;

var PowerList=['梅花','方片','红桃','黑桃'];

// stages:
// 0 preparation stage
// 1 play stage
// 2 effect stage
// 3 player attack stage
// 4 enemy attack stage

var randomNumber = function () {
    return 0.5 - Math.random();
}

function pointCount(i) {
    var e = i % 13;
    if (e == 0) {
        return 20;
    }
    if (e <= 10) {
        return e;
    }
    if (e == 11) {
        return 10;
    }
    return 15;

}

function updateSelectedLegal(mode) {
    if (mode == 0) {
        if (selectedCards.length == 0) {
            selectedLegal = true;
        }
        else if (selectedCards.length > 4) {
            selectedLegal = false;
        }
        else if (selectedCards.length == 1) {
            selectedLegal = true;
        }
        else if (selectedCards.length == 2) {
            var Card1 = selectedCards[0];
            var Card2 = selectedCards[1];
            if (Card1 % 13 == Card2 % 13 && selectedCardPoint <= 10 && Card1 % 13 != 1) {
                selectedLegal = true;
            }
            else if ((Card1 % 13 == 1 && Card2 % 13 != 1) || (Card2 % 13 == 1 && Card1 % 13 != 1)) {
                selectedLegal = true;
            }
            else {
                selectedLegal = false;
            }
            if (Card1 == 53 || Card1 == 54 || Card2 == 53 || Card2 == 54) {
                selectedLegal = false;
            }
        }
        else {
            for (var i = 0; i < selectedCards.length; i++) {
                if (selectedCards[i] % 13 == selectedCards[0] % 13) {
                    selectedLegal = true;
                    if (selectedCards[i] == 53 || selectedCards[i] == 54) {
                        selectedLegal = false;
                    }
                }
                else {
                    selectedLegal = false;
                }
            }
            if (selectedCards[0] % 13 == 1) {
                selectedLegal = false;
            }
        }
    }
    else {
        if (selectedCardPoint < enemyAttack) {
            selectedLegal = false;
        }
        else {
            selectedLegal = true;
        }
    }
}

function changeNum(Type, playAnimate) {
    var pileNum;
    var s = '';
    var mode = 0;
    switch (Type) {
        case 0: pileNum = drawPileNum; s = 'drawPile'; break;
        case 1: pileNum = discardPileNum; s = 'discardPile'; break;
        case 2: pileNum = enemyPileNum; s = 'enemyPile'; break;
        case 3: pileNum = specialPileNum; s = 'specialPile'; mode = 1; break;
    }
    var pile = document.getElementsByClassName(s)[0].getElementsByClassName('remain')[0];
    var objCard = pile.parentNode.getElementsByClassName('card')[0];

    var preNum = pile.dataset.num;
    pile.setAttribute('data-num', '' + pileNum);
    var step = preNum < pileNum ? 1 : -1;

    var inter = 135;
    clearInterval(pile.NumTimer);
    pile.style.display = 'block';


    pile.NumTimer = setInterval(function () {
        if (preNum % 10 == 0 || preNum % 10 == 9) {
            pile.children[0].children[0].src = './icons/Num' + parseInt(preNum / 10) + '.png';
            pile.children[1].children[0].src = './icons/Num' + preNum % 10 + '.png';

        }
        else {
            pile.children[1].children[0].src = './icons/Num' + preNum % 10 + '.png';
        }

        if (preNum - pileNum == step) {
            if (step > 0)
                preNum--;
            else
                preNum++;
            pile.children[0].children[0].src = './icons/Num' + parseInt(preNum / 10) + '.png';
            pile.children[1].children[0].src = './icons/Num' + preNum % 10 + '.png';
            pile.style.display = 'none';
            if (pileNum == 0) {
                pile.parentNode.getElementsByClassName('card')[0].style.visibility = 'hidden';
            }
            else {
                pile.parentNode.getElementsByClassName('card')[0].style.visibility = 'visible';
            }
            var opacity = 0.2 + 0.012 * pileNum;
            pile.parentNode.getElementsByClassName('card')[0].style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, ' + opacity + '), 0 6px 20px 0 rgba(0, 0, 0, ' + opacity + ')';

            clearInterval(pile.NumTimer);
        }
        else {
            if (preNum != pileNum && playAnimate == 1) {
                //animate
                var left = parseInt(getLeft(objCard.parentNode)) - 50;
                FullAnimate(objCard, left, getTop(objCard), objCard.parentNode, mode, 1, 10);
            }
            if (step > 0)
                preNum++;
            else
                preNum--;

        }
    }, inter);
}


function specialPileVisible() {
    var theSpecialPile = document.getElementsByClassName('specialPile')[0];
    theSpecialPile.style.display = 'block';
    theSpecialPile.parentNode.style.flex = '1';
}



function IconVisible(type) {
    var Icon;
    var w;
    switch (type) {
        case 0: Icon = document.querySelector('.confirmIcon'); break;
        case 1: Icon = document.querySelector('.cancelIcon'); break;
        case 2: Icon = document.querySelector('.numIcon'); break;
        case 3: Icon = document.querySelector('.heart'); break;
        case 4: Icon = document.querySelector('.diamond'); break;
        case 5: Icon = document.querySelector('.spade'); break;
        case 6: Icon = document.querySelector('.club'); break;
    }
    w = -Icon.offsetWidth;
    Icon.style.right = w + 'px';
    if (type < 2)
        iconVis[type] = 1;
}

function IconInVisible(type) {
    var Icon;
    switch (type) {
        case 0: Icon = document.querySelector('.confirmIcon'); break;
        case 1: Icon = document.querySelector('.cancelIcon'); break;
        case 2: Icon = document.querySelector('.numIcon'); break;
        case 3: Icon = document.querySelector('.heart'); break;
        case 4: Icon = document.querySelector('.diamond'); break;
        case 5: Icon = document.querySelector('.spade'); break;
        case 6: Icon = document.querySelector('.club'); break;
    }
    Icon.style.right = 0;
    if (type < 2)
        iconVis[type] = 0;
}

function enemyInfoVisible(type) {
    var enemyCard = document.getElementsByClassName('enemy')[0].getElementsByClassName('card')[0];
    var icon;
    icon = enemyCard.parentNode.children[type];
    var w = -icon.offsetWidth;
    icon.style.right = w + 'px';
    enemyInfoVis[type] = 1;
}

function enemyInfoInVisible(type) {
    var enemyCard = document.getElementsByClassName('enemy')[0].getElementsByClassName('card')[0];
    var icon;
    icon = enemyCard.parentNode.children[type];
    icon.style.right = 0;
    enemyInfoVis[type] = 0;
}

function initPile() {

    //抽牌堆
    for (var i = 1; i <= 10; i++) {
        for (var j = 0; j < 4; j++) {
            drawPile.push(i + 13 * j);
            drawPileNum++;
        }
    }
    for (var i = 0; i < playerNumber - 2; i++) {
        drawPile.push(53 + i);
        discardPileNum++;
    }
    drawPile.sort(randomNumber);
    //弃牌堆
    for (var i = 11; i <= 13; i++) {
        var tmpPile = [];
        for (var j = 0; j < 4; j++) {
            tmpPile.push(i + 13 * j);
            enemyPileNum++;
        }
        tmpPile.sort(randomNumber);
        enemyPile = enemyPile.concat(tmpPile);
    }
    //手牌上限
    if (playerNumber == 1) {
        specialPileState = true;
        specialPileNum = 2;
    }
    if (specialPileState) {
        specialPileVisible();
    }
    maxHandNum = 9 - playerNumber;

    var card = document.getElementsByClassName('card');
    for (var i = 0; i < 4; i++) {
        card[i].style.visibility = 'hidden';
    }
    //剩余牌显示
    for (var i = 0; i <= 3; i++) {
        changeNum(i, 1);
    }


    // drawPile[0]=2;
    // drawPile[1]=15;
    // drawPile[2]=28;
    // drawPile[3]=41;
    // for(var i=1;i<=8;i++)
    //     drawPile[i-1]=i;
}

function reloadEnemyIfo(Type) {

    var enemy = document.querySelector('.enemy');
    var icon = enemy.children[Type];
    var color = "";
    var num;
    switch (Type) {
        case 0: num = enemyAttack; break;
        case 1: num = enemyHeart; color = "R"; break;
    }
    var tens = parseInt(num / 10);
    var units = num % 10;

    if (enemyInfoVis[Type] == 0) {
        enemyInfoVisible(Type);
        icon.children[1].children[0].src = './icons/' + color + 'Num' + tens + '.png';
        icon.children[2].children[0].src = './icons/' + color + 'Num' + units + '.png';

    }
    else {
        enemyInfoInVisible(Type);
        setTimeout(function () {
            enemyInfoVisible(Type);
            icon.children[1].children[0].src = './icons/' + color + 'Num' + tens + '.png';
            icon.children[2].children[0].src = './icons/' + color + 'Num' + units + '.png';
        }, 1000);
    }
}

function setEnemyCard() {
    if (enemyPile.length != 0) {
        var currentCard = enemyPile.shift();
        enemyPoint = currentCard;
        enemyPower = parseInt((currentCard - 1) / 13);
        switch (currentCard % 13) {
            case 11: enemyAttack = 10; enemyHeart = 20; break;
            case 12: enemyAttack = 15; enemyHeart = 30; break;
            case 0: enemyAttack = 20; enemyHeart = 40; break;
            default: break;
        }
        enemyPileNum--;
        changeNum(2, 0);
        var card = document.querySelector('.enemyPile').getElementsByClassName('card')[0];
        card.getElementsByClassName('cardFront')[0].children[0].src = './images/Front (' + currentCard + ').png';
        var target = document.querySelector('.enemy').getElementsByClassName('bg')[0];
        target.parentNode.getElementsByClassName('card')[0].getElementsByClassName('cardFront')[0].children[0].src = './images/Front (' + currentCard + ').png';
        FullAnimate(card, getLeft(card), getTop(card), target, 1, 1, 10, function () {
            reloadEnemyIfo(0);
            reloadEnemyIfo(1);
            target.parentNode.getElementsByClassName('card')[0].style.visibility = 'visible';
        });
    }
    else {
        win = 1;
    }
}
//状态

function setHandCard(drawNum, callback) {
    var preHandNum = handNum;
    if (drawNum > maxHandNum - handNum) {
        drawNum = maxHandNum - handNum;
    }
    if (drawNum > drawPileNum) {
        drawNum = drawPileNum;
    }
    var card = document.querySelector('.drawPile').getElementsByClassName('card')[0];
    drawPileNum = drawPileNum - drawNum;
    changeNum(0, 0);
    timer = setInterval(function () {
        if (handNum == preHandNum + drawNum) {
            clearInterval(timer);
            callback && callback();
        }
        else {
            var currentCard = drawPile.shift();
            hand.push(currentCard);
            card.getElementsByClassName('cardFront')[0].children[0].src = './images/Front (' + currentCard + ').png';
            var target = document.querySelector('.hand').getElementsByClassName('card')[handNum];
            target.style.visibility = 'hidden';
            target.getElementsByClassName('cardFront')[0].children[0].src = './images/Front (' + currentCard + ').png';
            target.setAttribute('data-point', '' + currentCard);
            handNum++;


            FullAnimate(card, getLeft(card), getTop(card), target, 1, 1, 40, function () {
                target.style.visibility = 'visible';
            });
        }
    }, 135);

}

function eVis(e) {
    return function () {
        e.style.visibility = 'visible';
    }
}



function showCard() {
    var len = selectedCards.length;
    var handCds = document.querySelector('.hand').getElementsByClassName('card');
    var visCds = document.querySelector('.Vis').getElementsByClassName('card');
    for (var i = 0; i < len; i++) {
        var index = hand.indexOf(selectedCards[i]);
        var card = handCds[index];
        // console.log(index);
        var target = visCds[i];
        card.style.visibility = 'hidden';
        target.getElementsByClassName('cardFront')[0].children[0].src = card.getElementsByClassName('cardFront')[0].children[0].src;
        setTimeout(AutoAnimate(card, getLeft(card), getTop(card), target, 2, 1, 20, eVis(target)), 300);
    }




    for (var i = 0; i < len; i++) {
        hand.splice(hand.indexOf(selectedCards[i]), 1);

        handNum--;
        if (selectedCards[i] >= 53) {
            selectedCardEffects[4] = 1;
        }
        else {
            selectedCardEffects[parseInt((selectedCards[i] - 1) / 13)] = 1;
        }
    }

}


function refreshHand() {
    var cards = document.querySelector('.hand').getElementsByClassName('card');
    var len = cards.length;
    var handC = [];
    for (var i = 0; i < len; i++) {
        if (cards[i].style.visibility == 'visible') {
            handC.push(1);
        }
        else {
            handC.push(0);
        }
    }
    var idx = 0;

    while (idx != len) {
        if (handC[idx] == 1) {
            idx++;
        }
        else {
            var j = idx;
            while (j != len && handC[j] == 0) {
                j++;
            }
            if (j != len) {
                handC[j] = 0;
                handC[idx] = 1;
                var currentCard = cards[j];
                var target = cards[idx];
                currentCard.style.visibility = 'hidden';
                target.getElementsByClassName('cardFront')[0].children[0].src = currentCard.getElementsByClassName('cardFront')[0].children[0].src;
                target.setAttribute('data-point', currentCard.dataset.point);

                FullAnimate(currentCard, getLeft(currentCard), getTop(currentCard), target, 2, 1, 40);
                j = idx + 1;
            }
            else {
                setTimeout(function () {

                    for (var i = 0; i < len; i++) {
                        if (handC[i] == 1) {
                            cards[i].style.visibility = 'visible';
                        }
                    }
                }, 1000);
            }
            idx = j;
        }
    }


}

function effect1(events) {
    var drawNum = Math.min(maxHandNum - handNum, selectedCardPoint, drawPileNum);
    setHandCard(drawNum, function () {
        IconInVisible(4);
        events.transition();
    });
}

function effect2(events) {
    var cardNum = Math.min(discardPileNum, selectedCardPoint);
    drawPileNum += cardNum;
    discardPileNum -= cardNum;
    if (cardNum != 0) {
        changeNum(0);
        changeNum(1);
        discardPile.sort(randomNumber);
    }

    var card = document.querySelector('.discardPile').getElementsByClassName('card')[0];
    var target = document.querySelector('.drawPile').getElementsByClassName('bg')[0];
    var i = 0;
    timer = setInterval(function () {
        if (i == cardNum) {
            clearInterval(timer);
            IconInVisible(3);
            events.transition();
        }
        else {
            drawPile.push(discardPile.pop());
            FullAnimate(card, getLeft(card), getTop(card), target, 0, 1, 4);
            i++;
        }

    }, 135);

}


function effect3(events) {
    reloadEnemyIfo(0);
    IconInVisible(5);
    setTimeout(function () {
        events.transition();
    }, 600);
}

function effect0(events) {
    reloadEnemyIfo(1);
    IconInVisible(6);
    if (enemyHeart != 0) {
        events.transition();
    }
    else {
        var card = document.querySelector('.enemy').getElementsByClassName('card')[0];
        var target;
        var targetNum;
        if (enemyFriendly == 0) {
            discardPile.push(enemyPoint);
            discardPileNum++;
            target = document.querySelector('.discardPile').getElementsByClassName('bg')[0];
            targetNum = 1;
        }
        else {
            drawPile.unshift(enemyPoint);
            drawPileNum++;
            target = document.querySelector('.drawPile').getElementsByClassName('bg')[0];
            targetNum = 0;
        }
        card.style.visibility = 'hidden';

        FullAnimate(card, getLeft(card), getTop(card), target, 3, 1.02, 20, function () {
            enemyInfoInVisible(0);
            enemyInfoInVisible(1);
            changeNum(targetNum);

            events.transition();
        });
    }
}

function doEffect() {
    var events = {
        effectList: [],
        initialize: function () {

            this.transition();
        },
        transition: function () {
            if (this.effectList.length == 0) {
                IconInVisible(2);
                gameState.currentState = 3;
                gameState.transition();
            }
            else {
                var currentEvent = this.effectList.shift();
                switch (currentEvent) {
                    case 0: effect0(this); break;
                    case 1: effect1(this); break;
                    case 2: effect2(this); break;
                    case 3: effect3(this); break;
                    default: console.log('error'); break;
                }
            }
        }
    }


    //num
    if (selectedCardPoint != 0) {
        var numIcon = document.querySelector('.numIcon');
        numIcon.children[0].src = "./icons/Num" + parseInt(selectedCardPoint / 10) + ".png"
        numIcon.children[1].src = "./icons/Num" + selectedCardPoint % 10 + ".png"
        IconVisible(2);
    }

    //heart
    if (selectedCardEffects[2] == 1 && enemyPower != 2) {
        IconVisible(3);
        events.effectList.push(2);
    }

    //diamond
    if (selectedCardEffects[1] == 1 && enemyPower != 1) {
        IconVisible(4);
        events.effectList.push(1);
    }

    //spade
    if (selectedCardEffects[3] == 1 && enemyPower != 3) {
        enemyAttack = Math.max(0, enemyAttack - selectedCardPoint);
        IconVisible(5);
        events.effectList.push(3);

    }

    //club
    var damage = selectedCardPoint;
    if (selectedCardEffects[0] == 1 && enemyPower != 0) {
        damage *= 2;
        IconVisible(6);
    }
    if (damage != 0) {
        events.effectList.push(0);
        if (damage < enemyHeart) {
            enemyHeart = enemyHeart - damage;
            enemyFriendly = 0;

        }
        else if (damage == enemyHeart) {
            enemyHeart = 0;
            enemyFriendly = 1;
        }
        else {
            enemyHeart = 0;
            enemyFriendly = 0;
        }
    }

    setTimeout(function () {
        events.initialize();
    }, 1500);

}

function removeCard() {
    var len = selectedCards.length;
    var target = document.querySelector('.discardPile').getElementsByClassName('card')[0];
    var cards = document.querySelector('.Vis').getElementsByClassName('card');
    for (var i = 0; i < len; i++) {
        discardPileNum++;
        discardPile.push(selectedCards.pop());

        var card = cards[i];
        card.style.visibility = 'hidden';
        FullAnimate(card, getLeft(card), getTop(card), target, 3, 1, 40);

    }
    changeNum(1);
    selectedCards = [];
    selectedCardPoint = 0;
    selectedCardEffects = [0, 0, 0, 0, 0];
    selectedLegal = true;
}

function discard() {
    var len = selectedCards.length;
    var target = document.querySelector('.discardPile').getElementsByClassName('card')[0];
    var cards = document.querySelector('.hand').getElementsByClassName('card');

    var newArray = [];
    for (var i = 0; i < len; i++) {
        newArray.push(selectedCards[i]);
    }

    for (var i = 0; i < len; i++) {
        var currentCard = selectedCards.pop();
        discardPileNum++;
        discardPile.push(currentCard);

        var card = cards[hand.indexOf(currentCard)];

        card.style.visibility = 'hidden';
        FullAnimate(card, getLeft(card), getTop(card), target, 3, 1, 40);
    }
    changeNum(1);

    for (var i = 0; i < len; i++) {
        hand.splice(hand.indexOf(newArray[i]), 1);
        handNum--;
    }

    selectedCards = [];
    selectedCardPoint = 0;
    selectedCardEffects = [0, 0, 0, 0, 0];
    selectedLegal = true;


}

function stageN2() {
    IconVisible(0);
}

function stageN1() {
    initPile();
    IconInVisible(0);
    setTimeout(function () {
        gameState.currentState = 0;
        setHandCard(maxHandNum);
        gameState.transition();
    }, 7000);
}

function stage0() {


    setEnemyCard();

    if (win == 0) {
        setTimeout(function () {
            gameState.currentState = 1;
            gameState.transition();
        }, 5000);
    }
    else {
        setTimeout(function () {
            gameState.currentState = 6;
            gameState.transition();
        }, 3000);
    }
}

function stage1() {
    remind(0);
    document.querySelector('.enemy').getElementsByClassName('card')[0].style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)';
    document.querySelector('.enemy').getElementsByClassName('card')[0].style.left = '0';
    IconVisible(0);
}

function stage2() {
    eraseRemind();
    IconInVisible(0);
    showCard();

    setTimeout(function () {
        refreshHand();
        doEffect();
    }, 800);
}

function stage3() {
    setTimeout(function () {
        removeCard();
        if (enemyHeart == 0) {
            gameState.currentState = 0;
        }
        else {
            gameState.currentState = 4;
        }
        gameState.transition();
    }, 2000);
}

function stage4() {
    remind(1);
    // IconVisible(0);
    //247, 83, 83
    if (enemyAttack == 0) {
        selectedLegal = true;
        IconVisible(0);
    }

    document.querySelector('.enemy').getElementsByClassName('card')[0].style.boxShadow = '0 4px 8px 0 rgba(247, 83, 83, 0.2), 0 6px 20px 0 rgba(247, 83, 83, 0.2)';
    document.querySelector('.enemy').getElementsByClassName('card')[0].style.left = '-50px';
    enemyInfoVisible(0);
    var pointCnt = 0;
    for (var i = 0; i < handNum; i++) {
        pointCnt += pointCount(hand[i]);

    }
    if (pointCnt < enemyAttack && specialPileNum == 0) {
        setTimeout(function () {
            gameState.currentState = 6;
            document.querySelector('.enemy').getElementsByClassName('card')[0].style.boxShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)';
            document.querySelector('.enemy').getElementsByClassName('card')[0].style.left = '0';
            specialPileNum = -1;
            gameState.transition();
        }, 1000);
    }
}

function stage5() {
    eraseRemind();
    discard();
    setTimeout(function () {
        refreshHand();
        gameState.currentState = 1;
        gameState.transition();
    }, 2000);
}

function stage6() {
    // var s='Congratulation!You win the game!';
    // if(playerNumber==1)
    // {
    //     if(specialPileNum==2)
    //     {
    //         s="Congratulation!You win without jokers' help!";
    //     }
    //     else if(specialPileNum==1)
    //     {
    //         s="Congratulation!You win with the help of one joker!";
    //     }
    //     else
    //     {
    //         s="Congratulation!You win with the help of two jokers!";
    //     }
    // }
    // alert(s);
    // alert('Refresh to Restart!')
    var s = '胜利！';
    if (playerNumber == 1) {
        if (specialPileNum == 2) {
            s = "金牌胜利！！！";
        }
        else if (specialPileNum == 1) {
            s = "银牌胜利！！";
        }
        else if (specialPileNum == 0) {
            s = "铜牌胜利！";
        }
        else {
            s = '失败';
        }
    }
    alert(s);
    alert('刷新网页以重新游玩');
}

var gameState = {

    currentState: -2,

    initialize: function () {
        var self = this;
        self.transition();
    },

    transition: function () {
        switch (this.currentState) {
            case -2:
                stageN2();
                break;
            case -1:
                stageN1();
                break;
            case 0:
                stage0();
                break;
            case 1:
                stage1();
                break;
            case 2:
                stage2();
                break;
            case 3:
                stage3();
                break;
            case 4:
                stage4();
                break;
            case 5:
                stage5();
                break;
            case 6:
                stage6();
                break;
            default:
                console.log('Invalid State!');
                break;
        }
    }

};

function updateRemind1(){
    var info1 = document.querySelector('.noticeBoard').children[1];
    info1.innerHTML='已选点数：'+selectedCardPoint;
}

function remind(type) {
    var noticeBoard = document.querySelector('.noticeBoard');
    noticeBoard.style.left=getLeft(document.querySelector('.specialPile')
    
    )+'px';
    var info0 = noticeBoard.children[0];
    var info2 = noticeBoard.children[2];

    info0.innerHTML = '弃牌阶段';
    info2.style.display='none';
    if (type == 0)
    {
        info0.innerHTML = '出牌阶段';
        info2.innerHTML = PowerList[enemyPower]+'无效';
        info2.style.display='block';
    }

    updateRemind1();

    noticeBoard.style.display = 'block';
}

function eraseRemind() {
    var noticeBoard = document.querySelector('.noticeBoard');
    noticeBoard.style.display = 'none';
}





window.addEventListener('load', function () {


    var enemyCard = document.getElementsByClassName('enemy')[0].getElementsByClassName('card')[0];
    enemyCard.addEventListener('click', function () {
        enemyCard.style.top = '0';
        if (enemyInfoVis[2] == 0) {
            enemyInfoVisible(0);
            enemyInfoVisible(1);
            enemyInfoVis[2] = 1;
        }
        else {
            enemyInfoInVisible(0);
            enemyInfoInVisible(1);
            enemyInfoVis[2] = 0;
        }
    })
    enemyCard.addEventListener('mouseover', function () {
        enemyCard.style.top = '5px';
        if (enemyInfoVis[2] == 0 && (enemyInfoVis[0] == 0 || enemyInfoVis[1] == 0)) {
            enemyInfoVisible(0);
            enemyInfoVisible(1);
        }
    })
    enemyCard.addEventListener('mouseout', function () {
        enemyCard.style.top = '0';
        if (enemyInfoVis[2] == 0 && (enemyInfoVis[0] == 1 || enemyInfoVis[1] == 1)) {
            enemyInfoInVisible(0);
            enemyInfoInVisible(1);
        }
    })

    var card = document.getElementsByClassName('card');
    for (var i = 0; i < 4; i++) {
        card[i].addEventListener('mouseover', function () {
            this.style.top = '-5px';
            var remain = this.parentNode.getElementsByClassName('remain')[0];
            remain.style.display = 'block';
        })
        card[i].addEventListener('mouseout', function () {
            this.style.top = '0';
            var remain = this.parentNode.getElementsByClassName('remain')[0];
            remain.style.display = 'none';
        })
    }

    var handCard = document.querySelector('.hand').getElementsByClassName('card');
    for (var i = 0; i < handCard.length; i++) {
        handCard[i].addEventListener('mouseover', function () {
            this.style.top = '-20px';
        })
        handCard[i].addEventListener('mouseout', function () {
            if (this.dataset.selected == '0') {
                this.style.top = '0';
            }
            else {
                this.style.top = '-40px';
            }
        })
        handCard[i].addEventListener('click', function () {
            if (gameState.currentState == 1 || gameState.currentState == 4) {
                if (this.dataset.selected == '0') {
                    this.style.top = '-40px';
                    this.setAttribute('data-selected', '1');
                    selectedCards.push(parseInt(this.dataset.point));
                    selectedCardPoint += pointCount(parseInt(this.dataset.point));
                    if (gameState.currentState == 1) {
                        updateSelectedLegal(0);
                    }
                    else {
                        updateSelectedLegal(1);
                    }

                    if (selectedLegal) {
                        IconVisible(0);
                    }
                    else {
                        IconInVisible(0);
                    }
                    if (selectedCards.length != 0) {
                        IconVisible(1);
                    }
                    else {
                        IconInVisible(1);
                    }
                }
                else {
                    this.style.top = 0;
                    this.setAttribute('data-selected', '0');
                    selectedCards.splice(selectedCards.indexOf(parseInt(this.dataset.point)), 1);
                    selectedCardPoint -= pointCount(parseInt(this.dataset.point));
                    if (gameState.currentState == 1) {
                        updateSelectedLegal(0);
                    }
                    else {
                        updateSelectedLegal(1);
                    }
                    if (selectedLegal) {
                        IconVisible(0);
                    }
                    else {
                        IconInVisible(0);
                    }
                    if (selectedCards.length != 0) {
                        IconVisible(1);
                    }
                    else {
                        IconInVisible(1);
                    }
                }
                updateRemind1();
                // console.log(selectedCards);
                //247, 83, 83
            }
        })
    }


    var cancelIcon = document.querySelector('.cancelIcon');
    cancelIcon.addEventListener('click', function () {
        if (gameState.currentState == 1 || gameState.currentState == 4) {
            if (gameState.currentState == 1)
                selectedLegal = true;
            else if (enemyAttack == 0)
                selectedLegal = true;
            else
                selectedLegal = false;

            selectedCardPoint = 0;
            selectedCards.length = 0;
            for (var i = 0; i < handCard.length; i++) {
                handCard[i].style.top = 0;
                handCard[i].setAttribute('data-selected', '0');
            }
            IconInVisible(1);
            if(gameState.currentState==4)
            {
                if(enemyAttack==0)
                {
                    IconVisible(0);
                }
                else{
                    IconInVisible(0);
                }
            }
            else{
                IconVisible(0);
            }
            updateRemind1();
        }
    })

    var confirm = 0;

    var confirmIcon = document.querySelector('.confirmIcon');
    confirmIcon.addEventListener('click', function () {
        if (gameState.currentState == 1 || gameState.currentState == 4) {

            selectedLegal = true;
            for (var i = 0; i < handCard.length; i++) {
                handCard[i].style.top = 0;
                handCard[i].setAttribute('data-selected', '0');
            }
            IconInVisible(1);
            IconInVisible(0);
            
            if (gameState.currentState == 1) {
                if (selectedCardPoint == 0) {
                    if (confirm == 0) {
                        alert('未选择卡牌，确定要跳过出牌阶段吗？'+'\n'+'(请重新确认)');
                        cancelIcon.click();
                        confirm++;
                    }
                    else {
                        confirm = 0;
                        gameState.currentState = 2;
                    }
                }

                else {
                    confirm = 0;
                    gameState.currentState = 2;
                }

            }
            if (gameState.currentState == 4) {
                if (enemyAttack == 0) {
                    if (confirm == 0 && selectedCardPoint != 0) {
                        alert('敌人攻击力为0，确定要弃牌吗？'+'\n'+'(请重新确认)')
                        cancelIcon.click();
                        confirm++;
                    }
                    else {
                        confirm = 0;
                        gameState.currentState = 5;
                    }

                }
                else {
                    confirm = 0;
                    gameState.currentState = 5;
                }

            }





            gameState.transition();
        }
        if (gameState.currentState == -2) {
            gameState.currentState = -1;
            gameState.transition();
        }
    })


    var specialCard = this.document.querySelector('.specialPile').getElementsByClassName('card')[0];
    specialCard.addEventListener('click', function () {
        if (gameState.currentState == 1 || gameState.currentState == 4) {
            if (specialPileNum > 0) {
                selectedCards.length = 0;
                selectedCardPoint = 0;
                selectedLegal = true;
                for (var i = 0; i < handCard.length; i++) {
                    handCard[i].style.top = 0;
                    handCard[i].setAttribute('data-selected', '0');
                }
                for (var i = 0; i < hand.length; i++) {
                    selectedCards.push(hand[i]);
                }
                discard();
                IconInVisible(1);
                IconInVisible(0);

                specialCard.style.top = '-15px';

                specialPileNum--;
                changeNum(3);

                setTimeout(function () {
                    setHandCard(maxHandNum);
                    specialCard.style.top = '0';
                }, 1000);
            }
            console.log(gameState.currentState);
        }
    });

    // setInterval(AutoAnimate(animateCard,700, 0,enemyCard,1),2000);
    // for(var i=2;i<=6;i++)
    //     IconVisible(i);

    gameState.initialize();

});