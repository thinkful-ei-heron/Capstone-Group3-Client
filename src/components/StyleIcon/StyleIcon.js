import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'

const styleIconMap = {
  plus: <FontAwesomeIcon className="fa_plus" icon={faPlus} />,
  minus: <FontAwesomeIcon className="fa_minus" icon={faMinus} />,
  collapse: <FontAwesomeIcon className="fa_collapse" icon="angle-right" />,
  expand: <FontAwesomeIcon className="fa_expand" icon="angle-down" />,
  edit: <FontAwesomeIcon className="fa_edit" icon="edit" />,
  collapseBig: (
    <FontAwesomeIcon
      icon="chevron-up"
      style={{ fontSize: '25px', color: 'rgba(255,255,255,.5' }}
    />
  ),
  expandBig: (
    <FontAwesomeIcon
      icon="chevron-down"
      style={{ fontSize: '25px', color: 'rgba(255,255,255,.5' }}
    />
  ),
  default: null,
}

export default function StyleIcon({ style = 'default' }) {
  return styleIconMap[style]
}
