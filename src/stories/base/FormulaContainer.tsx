import React, { useRef, useState, useEffect, KeyboardEvent, RefObject } from 'react';
import { DotsVerticalIcon, CheckIcon, XIcon } from '@heroicons/react/solid';
import { Popover } from '@headlessui/react';
import { ReactComponent as Trash0Icon } from '../assets/icons/trash0.svg';
import { ReactComponent as PencilIcon } from '../assets/icons/pencil-edit.svg';
import { Dropdown } from '@restart/ui';

export interface FormulaProps {
    backgroundColor?: string;
    name: string;
    children?: React.ReactNode;
    color?: "blue" | "gray" | "orange" | "pink" | "teal" | "amber"
    onDelete?: () => void;
}

const colors = {
    blue: {
        border: 'border-blue-200',
        background: 'bg-blue-200',
    },
    gray: {
        border: 'border-stone-300',
        background: 'bg-stone-300',
    },
    orange: {
        border: 'border-orange-200',
        background: 'bg-orange-200',
    },
    pink: {
        border: 'border-fuchsia-200',
        background: 'bg-fuchsia-200',
    },
    teal: {
        border: 'border-teal-200',
        background: 'bg-teal-200',
    },
    amber: {
      border: 'border-amber-200',
      background: 'bg-amber-200',
    }
}

// When editing title of formula, this function receives the outside click event and let it finish editing
function ClickAwayListener(inputEl: RefObject<HTMLInputElement>) {
    const [clickedAway, setClickedAway] = useState(false)
    useEffect(() => {
        function handleClickOutside({ target }: MouseEvent) {
            if (inputEl.current && !inputEl.current.contains(target as Node)) {
                setClickedAway(true)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener('mouseup', () => { setClickedAway(false) })
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return clickedAway;
}
/*
    This is all formula container with title and border.
*/
export const FormulaContainer = ({
    backgroundColor = '',
    name,
    children,
    color = 'blue',
    onDelete,
}: FormulaProps) => {

    const [editing, setEditing] = useState<boolean>(false);
    const [displayTitle, setDisplayTitle] = useState<string>(name);
    const [editingText, setEditingText] = useState<string>('');
    const inputEl = useRef<HTMLInputElement>(null);
    const [isFinalFormula, setIsFinalFormula] = useState<boolean>(false);

    // This is outside click listener and finish editing when the user click outside of <input />
    const clicked = ClickAwayListener(inputEl);
    useEffect(() => {
        clicked && finishEditing()
    }, [clicked]);

    const liStyle = 'px-4 py-2 hover:bg-teal-50 hover:cursor-pointer text-left m-0';

    // on click "Rename" menu, enable edit mode
    const onRename = () => {
        setEditing(true);
        setEditingText(displayTitle);

        setTimeout(() => inputEl.current?.select(), 10);
    };

    // Finish editing
    const finishEditing = () => {
        setEditing(false);
        if (editingText !== '')
            setDisplayTitle(editingText);
    };

    const onRenameKeydown = (e: KeyboardEvent) => {
        if (e.key == 'Enter')
            finishEditing();
    };

    // Toggle final formula
    const onToggleFinalFormula = () => {
        setIsFinalFormula(!isFinalFormula);
    };

    const onDeleteFormula = () => {
        onDelete && onDelete();
    };

    return (
        <>
            <span className={`${colors[color].background} relative px-1.5 py-0.5 rounded-t-[5px] text-xs text-zinc-700 inline-block ml-6`}>
                <span className={`${editing ? 'invisible' : ''}`}>{!editing ? displayTitle : editingText}</span>
                {editing &&
                    <input
                        type='text'
                        ref={inputEl}
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={onRenameKeydown}
                        className='absolute top-0 right-0 left-0 bottom-0 bg-transparent pl-1.5 focus:outline-0'
                    />
                }

                <Dropdown>
                    <Dropdown.Toggle>
                        {(props) => (
                            <button {...props} className='focus:outline-0'>
                                <DotsVerticalIcon className='w-3 h-3 mt-0.5 ml-2' />
                            </button>
                        )}
                    </Dropdown.Toggle>
                    <Dropdown.Menu flip offset={[0, 8]}>
                        {(menuProps, meta) => (
                            <ul
                                {...menuProps}
                                className="absolute z-10 w-[max-content] bg-white flex flex-col left-[90%] top-0"
                                style={{
                                    transition: "visibility 500ms, opacity 500ms",
                                    visibility: meta.show ? "visible" : "hidden",
                                    opacity: meta.show ? "1" : "0",
                                }}
                            >
                                <Dropdown.Item className={liStyle} onClick={() => { onRename(); }}><PencilIcon className='w-4 h-4 mr-2' />Rename</Dropdown.Item>

                                <Dropdown.Item className={liStyle}
                                    onClick={() => { onToggleFinalFormula(); }}
                                >

                                    {isFinalFormula ?
                                        <><XIcon className='w-4 h-4 mr-2' /> Unselect as final formula</>
                                        :
                                        <><CheckIcon className='w-4 h-4 mr-2' /> Select as final formula</>}
                                </Dropdown.Item>

                                <Dropdown.Item className={liStyle} onClick={() => onDeleteFormula()}><Trash0Icon className='w-4 h-4 mr-2' />Delete</Dropdown.Item>
                            </ul>
                        )}
                    </Dropdown.Menu>
                </Dropdown>

                {/* <Popover className={`relative inline-block ${editing ? 'invisible' : ''}`}>
                    <Popover.Button className='focus:outline-0'><DotsVerticalIcon className='w-3 h-3 mt-0.5 ml-2' /></Popover.Button>

                    <Popover.Panel className="absolute z-10">
                        {({ close }) => (

                            <div className="bg-white">
                                <ul className='w-[max-content]'>
                                    <li className={liStyle} onClick={() => { close(); onRename(); }}><PencilIcon className='w-4 h-4 mr-2' />Rename</li>

                                    <li className={liStyle}
                                        onClick={() => { close(); onToggleFinalFormula(); }}
                                    >

                                        {isFinalFormula ?
                                            <><XIcon className='w-4 h-4 mr-2' /> Unselect as final formula</>
                                            :
                                            <><CheckIcon className='w-4 h-4 mr-2' /> Select as final formula</>}
                                    </li>

                                    <li className={liStyle} onClick={() => onDeleteFormula()}><Trash0Icon className='w-4 h-4 mr-2' />Delete</li>
                                </ul>
                            </div>
                        )}
                    </Popover.Panel>

                </Popover> */}
            </span>
            <br />
            <div className={`relative inline-flex border-[3px] rounded-[30px] ${colors[color].border} ${backgroundColor} p-1.5`}>
                {children}

                {isFinalFormula && <CheckIcon className='w-5 h-5 text-green-600 absolute left-[100%] top-0 bottom-0 my-auto ml-3' />}
            </div>
        </>
    );
}
