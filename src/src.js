//start
const STATUS_LEFT = -1
const STATUS_RIGHT = 0
const STATUS_START = 1
const STATUS_NORMAL = 2

const STATUS_DOWN_START = 3
const STATUS_DOWN_END = 14//--> top 爆炸 end

const STATUS_BOOM_START = 15
const STATUS_BOOM_END = 26//--> 开始下落

const STATUS_GAME_OVER = 27
//end

c = c.getContext('2d');
c.font = '40px A';

nowTime = timeReverses = timeCount = 0;
newX = status = 1;
gameMap = [timeArr = []];

gameMap.length = 54;
gameMap.fill(0);

tweenTo = (v, n, y, A) => ({
    ...v,
    startX: v.x,
    startY: v.y,
    endX: n,
    endY: y,
    startTime: nowTime
});

onkeydown = (v, n, y, A) => {
    ;
    if (v.keyCode == 87) timeReverses = 1;
    if (status == STATUS_NORMAL && !timeReverses) {
        ;
        if (v.keyCode == 65 && newX && newX--) status = STATUS_LEFT;
        if (v.keyCode == 68 && newX < 3 && ++newX) status = STATUS_RIGHT;
        if (v.keyCode == 83) status = STATUS_DOWN_START
    }
};

onkeyup = (v, n, y, A) => {
    ;
    if (v.keyCode == 87) timeReverses = 0
};


render = (v, n, y, A) => {
    requestAnimationFrame(render);

    if (timeReverses && timeArr.length > 0) {
        timeCount = 0;
        v = timeArr.pop();
        nowTime = v.nowTime;
        newX = v.newX;
        status = v.status;
        gameMap = v.gameMap
    } else {
        timeCount = status == STATUS_NORMAL || status == STATUS_GAME_OVER ? timeCount + 1 : 0;
        timeCount < 11 && timeArr.push({ nowTime, newX, status, gameMap });
        nowTime++;
        if (status < STATUS_START)
            gameMap = gameMap.map(
                A = (v, n, y, A) =>
                    n > 47 && (v = status == STATUS_LEFT ? y[n + 1] : n == 48 ? 0 : y[n - 1]) ? tweenTo(v, n % 6, 8) : v
            );

        if (status == STATUS_START)
            gameMap = gameMap.map(
                A = (v, n, y, A) =>
                    n > 47 + newX && n < 51 + newX ? tweenTo({ x: n % 6, y: 10, i: Math.random() > 0.5 ? 1 : 2 }, n % 6, 8) : v
            );

        if (status == STATUS_BOOM_START)
            gameMap = gameMap.map(
                A = (v, n, y, A) =>
                    v.toPoint ? tweenTo(v, v.toX, v.toY) : v
            );

        if (status == STATUS_BOOM_END)
            gameMap = gameMap.map(
                A = (v, n, y, A) =>
                    v.isOver && !v.toPoint ? { ...v, isOver: 0, i: v.i + 1 } : v
            );

        if (status == STATUS_DOWN_START)
            gameMap = gameMap.map(
                A = (v, n, y, A) => (
                    x = n % 6,
                    v = y.filter(A = (v, n, y, A) => v && !v.isOver && n % 6 == x)[~~(n / 6)] //lazy
                ) ? tweenTo(v, x, ~~(n / 6)) : 0

            );

        //结束下落
        downEndTag = STATUS_START;

        if (status == STATUS_DOWN_END) gameMap.map(A = (v, n, y, A) => {
            A = [6, 1, 7, - 5];
            for (i = 0; i < (n % 6 == 0 || n % 6 == 5 ? 1 : 4); i++) {
                a = gameMap[A[i] + n];
                b = gameMap[- A[i] + n];
                if (a && b && a.i == v.i && b.i == v.i) {
                    downEndTag = STATUS_BOOM_START;
                    v.isOver = 1;
                    v.toPoint = 0;

                    v = a;
                    if (!v.isOver) {
                        v.toPoint = v.isOver = 1;
                        v.toX = n % 6;
                        v.toY = ~~(n / 6)
                    }

                    v = b;
                    if (!v.isOver) {
                        v.toPoint = v.isOver = 1;
                        v.toX = n % 6;
                        v.toY = ~~(n / 6)
                    }
                }
            }
            ;
            if (v && n > 47 && downEndTag == STATUS_START)
                downEndTag = STATUS_GAME_OVER
        });

        //动画  
        gameMap = gameMap.map(A = (v, n, y, A) =>
            v ? (
                A = (nowTime - v.startTime) / 11,
                A = (A > 1) ? 1 : A,
                v = {
                    ...v,
                    x: - v.startX * A + v.endX * A + v.startX,
                    y: - v.startY * A + v.endY * A + v.startY
                },
                v
            ) : 0
        );

        status = status == STATUS_NORMAL || status == STATUS_GAME_OVER ? status :
            status < STATUS_START ? STATUS_NORMAL :
                status == STATUS_DOWN_END ? downEndTag :
                    status == STATUS_BOOM_END ? STATUS_DOWN_START : status + 1

    }


    //draw
    i = 0;
    c.fillStyle = 'hsla(' + i + ',40%,0%,0.2)';
    c.fillRect(0, 0, 300, 500);
    gameMap.map(A = (v, n, y, A) => {
        x = 50 * v.x;
        y = 450 - 50 * v.y;
        i = v.i * 35;

        c.fillStyle = 'hsla(' + i + ',40%,65%,1)';
        c.fillRect(x, y, 50, 50);

        c.fillStyle = 'hsla(' + i + ',40%,20%,1)';
        c.fillText(v.i, x + 12, y + 40);
    });
};

render()