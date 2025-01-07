'use client';

export const CANVAS_CONFIG = {
    WIDTH: 1000,
    HEIGHT: 600,
    NET_SEGMENT_HEIGHT: 10,
    NET_GAP: 15,
    PADDLE_GLOW_BLUR: 15,
    BALL_GLOW_BLUR: 20,
    PADDLE_GLOW_COLOR: "rgba(0, 200, 255, 0.8)",
    BALL_GLOW_COLOR: "rgba(255, 255, 255, 0.8)",
    BACKGROUND_COLOR: "rgba(31, 41, 90, 1)",
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
    ctx.fillStyle = CANVAS_CONFIG.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CANVAS_CONFIG.WIDTH, CANVAS_CONFIG.HEIGHT);
};

export const drawNet = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'white';
    const netX = CANVAS_CONFIG.WIDTH / 2 - 1;

    for (let i = 0; i < CANVAS_CONFIG.HEIGHT; i += CANVAS_CONFIG.NET_GAP) {
        ctx.fillRect(netX, i, 2, CANVAS_CONFIG.NET_SEGMENT_HEIGHT);
    }
};

export const drawPaddle = (ctx: CanvasRenderingContext2D, paddle: RenderableObject) => {
    ctx.save();
    ctx.shadowBlur = CANVAS_CONFIG.PADDLE_GLOW_BLUR;
    ctx.shadowColor = CANVAS_CONFIG.PADDLE_GLOW_COLOR;
    ctx.fillStyle = 'white';
    ctx.fillRect(paddle.x, paddle.y, paddle.w!, paddle.h!);
    ctx.restore();
};

export const drawBall = (ctx: CanvasRenderingContext2D, ballObj: RenderableObject) => {
    ctx.save();
    ctx.shadowBlur = CANVAS_CONFIG.BALL_GLOW_BLUR;
    ctx.shadowColor = CANVAS_CONFIG.BALL_GLOW_COLOR;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(ballObj.x, ballObj.y, ballObj.r!, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};
