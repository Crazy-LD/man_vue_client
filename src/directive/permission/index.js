import store from '../../store';
export default {
    inserted(el, binding) {
        const { value } = binding;
        const { permissions } = store.state.permission;
        if (value != undefined) {
            if (!permissions.includes(value)) {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            }
        } else {
            throw new Error('need a type of number, like 1');
        }
    }
}