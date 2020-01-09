import React, { Component } from 'react';
import { Input, Label } from '../Form/Form';
import FirebaseContext from '../../services/context';

export default class JobForm extends Component {
    static contextType = FirebaseContext

    handleSubmit = e => {
        e.preventDefault()
        console.log(this.props)
        const { name, description, deadline } = e.target
        const data = {
            name: name.value,
            description: description.value,
            deadline: new Date(deadline.value),
            approval: false,
            date_created: new Date(),
            organization: this.context.user.org.name,
            progress: 0,
            project_id: this.props.project_id,
            project_manager: this.props.project_manager,
            project_workers: [],
            revision: false,
            status: 'completed',
        }
        this.context.addJob(data, this.props.project_id)
        this.props.history.push(`/project/${this.props.project_id}`)
    }

    render() {
        return (
            <form className='JobForm' onSubmit={(e) => this.handleSubmit(e)}>
                <Label htmlFor='job_name'>Name</Label>
                <Input name='name' id='job_name' type='text' placeholder='Job Name' required />
                <Label htmlFor='job_description'>Description</Label>
                <Input name='description' id='job_description' type='text' placeholder='Job Description' required />
                <Label htmlFor='job_deadline'>Deadline</Label>
                <input name='deadline' id='job_deadline' type='date' />
                <button type='submit'>SUBMIT</button>
            </form>
        )
    }
}