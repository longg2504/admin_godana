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
      id: 'place',
      title: 'Place',
      type: 'collapse',
      url: '/place/place-list',
      icon: icons.IconMapPins,
      children: [
        {
          id: 'place-list',
          title: 'Place List',
          type: 'item',
          url: '/place/place-list',
          breadcrumbs: false
        },
        {
          id: 'create-place',
          title: 'Create Place',
          type: 'item',
          url: '/place/create-place',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'post',
      title: 'Post',
      type: 'collapse',
      icon: icons.IconShadow,
      children: [
        {
          id: 'post-list',
          title: 'Post List',
          type: 'item',
          url: '/post/post-list',
          breadcrumbs: false
        },
      ]
    },
    {
      id: 'user',
      title: 'User',
      type: 'collapse',
      icon: icons.IconWindmill,
      children: [
        {
          id: 'user-list',
          title: 'User List',
          type: 'item',
          url: '/user/user-list',
          breadcrumbs: false
        },
        {
          id: 'user-ban',
          title: 'User Ban',
          type: 'item',
          url: '/user/user-ban',
          breadcrumbs: false
        },
      ]
    }
  ]
};

export default utilities;
