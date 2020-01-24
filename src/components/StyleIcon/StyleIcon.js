import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMinus,
  faPlus,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons'
import {
  faCalendarCheck,
  faCheckSquare,
  faClock,
  faArrowAltCircleUp,
} from '@fortawesome/free-regular-svg-icons'

const styleIconMap = {
  revise: (
    <FontAwesomeIcon className="fa_clipboard_list" icon="clipboard-list" />
  ),
  submit: <FontAwesomeIcon className="fa_arrow_up" icon={faArrowAltCircleUp} />,
  clock: <FontAwesomeIcon className="fa_clock" icon={faClock} />,
  left: <FontAwesomeIcon className="fa_angle_left" icon="angle-left" />,
  collapse: <FontAwesomeIcon className="fa_angle_right" icon="angle-right" />,
  complete: (
    <FontAwesomeIcon className="fa_calendar_check" icon={faCalendarCheck} />
  ),
  approve: <FontAwesomeIcon className="fa_check_square" icon={faCheckSquare} />,
  close: <FontAwesomeIcon className="fa_close" icon={faTimesCircle} />,
  plus: <FontAwesomeIcon className="fa_plus" icon={faPlus} />,
  minus: <FontAwesomeIcon className="fa_minus" icon={faMinus} />,
  expand: <FontAwesomeIcon className="fa_expand" icon="angle-down" />,

  edit: <FontAwesomeIcon className="fa_edit" icon="edit" />,
  collapseBig: <FontAwesomeIcon icon="chevron-up" />,
  expandBig: <FontAwesomeIcon icon="chevron-down" />,
  default: null,
}

export default function StyleIcon({ style = 'default' }) {
  return styleIconMap[style]
}
