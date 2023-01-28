<script setup lang="ts">
import { ref } from "vue";
import { useMutation, useQuery } from "villus";

const GetTasks = `#graphql
query TasksQuery {
  tasks {
    id
    title
    body
    status
  }
}
`;
const { data, isFetching } = useQuery({
  query: GetTasks,
  tags: ["get_all_tasks"],
});

const CreateTask = `#graphql
mutation CreateTask($createTaskContent: CreateTaskContent!) {
  createTask(content: $createTaskContent) {
    body
    created_at
    status
    title
  }
}
`;

const UpdateTask = `#graphql
mutation UpdateTask($updateTaskId: ID!, $updateTaskContent: UpdateTaskContent!) {
  updateTask(id: $updateTaskId, content: $updateTaskContent) {
    body
    created_at
    status
    title
  }
}
`;

function handleChange(e: any, status: string) {
  const { execute } = useMutation(UpdateTask, {
    refetchTags: ["get_all_tasks"],
  });
  const updateTaskId = e.target.value;
  const updateTaskContentStatus = status === "ACTIVE" ? "COMPLETED" : "ACTIVE";
  const variables = {
    updateTaskId,
    updateTaskContent: {
      status: updateTaskContentStatus,
    },
  };

  /* data.value.tasks = data.value.tasks.map((item: any) => {
    if (item.id == updateTaskId) {
      item.status = updateTaskContentStatus;
    }
    return item;
  }); */
  execute(variables);
}

const newTask = ref<string>("");

function handleCreate() {
  if (newTask.value.length > 10) {
    const { execute } = useMutation(CreateTask, {
      refetchTags: ["get_all_tasks"],
    });
    const variables = {
      createTaskContent: {
        title: newTask.value,
      },
    };
    execute(variables);
    newTask.value = "";
  }
}
</script>
<!-- 
      -->
<template>
  <div v-if="isFetching">Data is fetching ...</div>
  <div v-else v-for="(item, index) of data.tasks" :key="index">
    <input
      class="hidden"
      type="checkbox"
      :id="item.id"
      :value="item.id"
      @change="handleChange($event, item.status)"
    />

    <label
      class="flex items-center h-10 px-2 rounded cursor-pointer hover:bg-gray-900"
      :for="item.id"
    >
      <span
        class="flex items-center justify-center w-5 h-5 text-transparent border-2 border-gray-500 rounded-full"
        :class="
          item.status === 'ACTIVE'
            ? ''
            : 'bg-emerald-500 text-white border-1 border-emerald-500'
        "
      >
        <svg
          class="w-4 h-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <span
        class="ml-4 text-sm"
        :class="item.status === 'ACTIVE' ? '' : 'line-through text-gray-400'"
        >{{ item.title }}</span
      >
    </label>
  </div>

  <div
    class="flex items-center w-full h-8 px-2 mt-2 text-sm font-medium rounded"
  >
    <svg
      class="w-5 h-5 text-gray-400 fill-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
    <input
      class="flex-grow h-8 ml-4 bg-transparent focus:outline-none font-medium"
      type="text"
      placeholder="add a new task"
      v-model="newTask"
      @keypress.enter="handleCreate()"
    />
  </div>
</template>
