import Vue from 'vue';
import Router from 'vue-router';
import Login from '../views/Login/Login';
import Register from '../views/Register/Register';
import Layout from '../views/layout/Layout';
import DashBoard from '../views/DashBoard/DashBoard';

const AuditRecMan = () => import('../views/AuditRecMan/AuditRecMan');
const ConferRoomMan = () => import('../views/ConferRoomMan/ConferRoomMan');
const LogAuditMan = () => import('../views/LogAuditMan/LogAudit/LogAudit');
const LogSetting = () => import('../views/LogAuditMan/LogSetting/LogSetting');
const ProcessAudit = () => import('../views/ProcessAudit/ProcessAudit');
const ResetPassword = () => import('../views/ResetPassword/ResetPassword');
const DepartmentMan = () => import('../views/DepartmentMan/DepartmentMan');
const UserMan = () => import('../views/UserMan/UserMan');
const RoleMan = () => import('../views/RoleMan/RoleMan');
const PositionMan = () => import('../views/PositionMan/PositionMan');
const ConferTerminalMan = () => import('../views/ConferTerminalMan/ConferTerminalMan');
const AuthMan = () => import('../views/AuthMan/AuthMan');

export const constantRoutesMap = [
    {
        path: '/login',
        component: Login,
        hidden: true
    },
    {
        path: '/reset',
        component: ResetPassword,
        hidden: true
    },
    {
        path: '/register',
        component: Register,
        hidden: true
    },
    {
        path: '/',
        redirect: '/dashboard',
        component: Layout,
        hidden: true
    },
    {
        path: '/dashboard',
        icon: 'el-icon-s-home',
        title: '首页',
        noDropMenu: true,
        redirect: '/dashboard/index',
        component: Layout,
        children: [
            {
                path: 'index',
                component: DashBoard
            }
        ]
    },
    {
        path: '/404',
        component: () => import('../views/ErrorPage/404'),
        hidden: true
    },
];

export const asyncRoutesMap = [
    {
        path: '/userman',
        icon: "el-icon-orange",
        title: '用户管理',
        noDropMenu: true,
        redirect: '/userman/index',
        component: Layout,
        children: [
            {
                path: 'index',
                component: UserMan
            }
        ],
        meta: {
            permission: [1]
        }
    },
    {
        path: '/roleman',
        icon: "el-icon-refrigerator",
        title: '角色管理',
        noDropMenu: true,
        redirect: '/roleman/index',
        component: Layout,
        children: [
            {
                path: 'index',
                component: RoleMan
            }
        ],
        meta: {
            permission: [6]
        }
    },
    {
        path: '/departmentman',
        icon: "el-icon-coffee",
        title: '部门管理',
        noDropMenu: true,
        redirect: '/departmentman/index',
        component: Layout,
        children: [
            {
                path: 'index',
                component: DepartmentMan
            }
        ],
        meta: {
            permission: [11]
        }
    },

    {
        path: '/positionman',
        icon: "el-icon-goblet-square-full",
        title: '职位管理',
        noDropMenu: true,
        redirect: '/positionman/index',
        component: Layout,
        children: [
            {
                path: 'index',
                component: PositionMan
            }
        ],
        meta: {
            permission: [16]
        }
    },
    {
        path: '/conferroomman',
        icon: "el-icon-potato-strips",
        title: '会议室管理',
        noDropMenu: true,
        redirect: '/conferroomman/index',
        component: Layout,
        children: [
            {
                path: 'index',
                component: ConferRoomMan
            }
        ],
        meta: {
            permission: [21]
        }
    },
    {
        path: '/conferterminal',
        icon: "el-icon-goblet-square-full",
        title: '会议室终端管理',
        noDropMenu: true,
        redirect: '/conferterminal/index',
        component: Layout,
        children: [
            {
                path: 'index',
                component: ConferTerminalMan
            }
        ],
        meta: {
            permission: [26]
        }
    },
    {
        path: '/authman',
        icon: "el-icon-cold-drink",
        title: '权限管理',
        noDropMenu: true,
        redirect: '/authman/index',
        component: Layout,
        children: [
            {
                path: 'index',
                component: AuthMan
            }
        ],
        meta: {
            permission: [31]
        }
    },
    {
        path: '/auditrecman',
        icon: "el-icon-ice-cream-round",
        title: '审计管理',
        noDropMenu: true,
        redirect: '/auditrecman/index',
        component: Layout,
        children: [
            {
                path: 'index',
                component: AuditRecMan
            }
        ],
        meta: {
            permission: [34]
        }
    },
    {
        path: '/processaudit',
        redirect: '/processaudit/index',
        title: '流程审计',
        icon: 'el-icon-lollipop',
        noDropMenu: true,
        component: Layout,
        children: [
            {
                path: 'index',
                component: ProcessAudit
            }
        ],
        meta: {
            permission: [38]
        }
    },
    {
        path: '/logauditman',
        component: Layout,
        icon: 'el-icon-milk-tea',
        title: '日志审计管理',
        children: [
            {
                path: 'logaudit',
                title: '日志审计',
                component: LogAuditMan,
                meta: {
                    permission: [43]
                }
            },
            {
                path: 'logsetting',
                title: '日志设置',
                component: LogSetting,
                meta: {
                    permission: [45]
                }
            }
        ],
        meta: {
            permission: [43, 45]
        }
    },
    {
        path: '/test',
        icon: 'el-icon-s-home',
        title: '测试',
        noDropMenu: true,
        redirect: '/test/index',
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import('../views/Test.vue')
            }
        ]
    },
    { path: '*', redirect: '/404', hidden: true }
];

Vue.use(Router);

const createRouter = () => new Router({ routes: constantRoutesMap });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() { // 解决addRoutes方法只能够新增路由，而不能够删除路由的弊端
    const newRouter = createRouter();
    router.matcher = newRouter.matcher;
}

export default router;