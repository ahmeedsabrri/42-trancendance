'use client';



export const CANVAS_CONFIG = {
    WIDTH: 1000,
    HEIGHT: 600,
    NET_SEGMENT_HEIGHT: 10,
    NET_GAP: 15,
    PADDLE_GLOW_BLUR: 30,
    BALL_GLOW_BLUR: 20,
    PADDLE_GLOW_COLOR: "rgba(6, 182, 212, 0.8)",
    BALL_GLOW_COLOR: "rgba(248, 250, 252, 0.9)",
    FPS: 60,
};

interface RenderableObject {
    x: number;
    y: number;
    w?: number;
    h?: number;
    r?: number;
}

export const drawTable = (ctx: CanvasRenderingContext2D) => {
    
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);

    ctx.globalAlpha = 0.1;
    for(let i = 0; i < CANVAS_CONFIG.WIDTH; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_CONFIG.HEIGHT);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
};

export const drawNet = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const netX = CANVAS_CONFIG.WIDTH / 2 - 1;

    for (let i = 0; i < CANVAS_CONFIG.HEIGHT; i += CANVAS_CONFIG.NET_GAP) {
        ctx.fillRect(netX, i, 2, CANVAS_CONFIG.NET_SEGMENT_HEIGHT);
    }
};

export const drawPaddle = (ctx: CanvasRenderingContext2D, paddle: RenderableObject) => {
    ctx.save();
    ctx.shadowBlur = CANVAS_CONFIG.PADDLE_GLOW_BLUR;
    ctx.shadowColor = CANVAS_CONFIG.PADDLE_GLOW_COLOR;
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fillRect(paddle.x, paddle.y, paddle.w!, paddle.h!);
    ctx.restore();
};

export const drawBall = (ctx: CanvasRenderingContext2D, ballObj: RenderableObject) => {
    ctx.save();
    ctx.shadowBlur = CANVAS_CONFIG.BALL_GLOW_BLUR;
    ctx.shadowColor = CANVAS_CONFIG.BALL_GLOW_COLOR;
    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.beginPath();
    ctx.arc(ballObj.x, ballObj.y, ballObj.r!, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};
