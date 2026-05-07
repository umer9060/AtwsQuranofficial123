import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import coursesRouter from "./courses";
import lessonsRouter from "./lessons";
import hadithsRouter from "./hadiths";
import liveClassesRouter from "./live_classes";
import qnaRouter from "./qna";
import dashboardRouter from "./dashboard";
import paymentsRouter from "./payments";
import ulemaRouter from "./ulema";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(coursesRouter);
router.use(lessonsRouter);
router.use(hadithsRouter);
router.use(liveClassesRouter);
router.use(qnaRouter);
router.use(dashboardRouter);
router.use(paymentsRouter);
router.use(ulemaRouter);

export default router;
