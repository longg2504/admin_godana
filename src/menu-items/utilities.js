// assets
import { IconTypography, IconMapPins , IconShadow, IconWindmill } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconMapPins  ,
  IconShadow,
  IconWindmill
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Management',
  type: 'group',
  children: [
    {
      id: 'util-typography',
      title: 'Contact',
      type: 'collapse',
      icon: icons.IconTypography,
      children: [
        {
          id: 'tabler-icons',
          title: 'Contact List',
          type: 'item',
          url: '/icons/tabler-icons',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'util-place',
      title: 'Place',
      type: 'collapse',
      icon: icons.IconMapPins,
      children: [
        {
          id: 'tabler-icons',
          title: 'Create Place',
          type: 'item',
          url: '/icons/tabler-icons',
          breadcrumbs: false
        },
        {
          id: 'tabler-icons',
          title: 'Place List',
          type: 'item',
          url: '/utils/util-place',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'util-shadow',
      title: 'Post',
      type: 'collapse',
      url: '/utils/util-shadow',
      icon: icons.IconShadow,
      children: [
        {
          id: 'tabler-icons',
          title: 'Post List',
          type: 'item',
          url: '/icons/tabler-icons',
          breadcrumbs: false
        },
      ]
    },
    {
      id: 'icons',
      title: 'User',
      type: 'collapse',
      icon: icons.IconWindmill,
      children: [
        {
          id: 'tabler-icons',
          title: 'User List',
          type: 'item',
          url: '/icons/tabler-icons',
          breadcrumbs: false
        },
        {
          id: 'material-icons',
          title: 'Mục nhỏ 2',
          type: 'item',
          external: true,
          target: '_blank',
          // url: 'https://mui.com/material-ui/material-icons/',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default utilities;
