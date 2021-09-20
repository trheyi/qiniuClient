<style lang="scss" scoped>
.layout {
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  width: 100%;
  text-align: center;
  padding: 10px;
}

.table {
  width: 60%;
}

.buttons {
  margin-top: 50px;
}

.item {
  padding: 5px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .name {
    font-size: 14px;
    margin-left: 20px;
  }

  .long {
    flex-grow: 1;
  }

  &:nth-child(2n) {
    background-color: var(--bg-item-selected);
  }

  &:hover {
    background: rgba(28, 36, 56, 0.2);
  }
}
</style>
<style>
.ivu-select-dropdown {
  max-height: 100px;
}
</style>
<template>
  <div class="layout drag">
    <Tabs class="no-drag table" type="card" ref="tabs" @on-click="onTabClick">
      <TabPane :disabled="!(this.coses && this.coses.length > 0)" name="已登录" label="已登录">
        <div class="item" v-for="(item, index) in this.coses" :key="index" @click="openCOS(item)">
          <span :class="`iconfont icon-${item.key}`" style="font-size: 20px;"></span>
          <span class="name long">{{ item.name }}</span>
          <Icon type="ios-trash-outline" size="20" @click.stop="removeCOS(item)" />
        </div>
      </TabPane>
      <TabPane v-for="item in brands" :key="item.key" :name="item.key" :label="item.name">
        <h3 class="title">设置{{ item.name }}密钥</h3>
        <Form :model="formItem" :ref="item.key" :rules="ruleItem" :label-width="150">
          <template>
            <Form-item label="别名" prop="name">
              <Input v-model="formItem.name" placeholder="别名" />
            </Form-item>
            <Form-item label="ACCESS_KEY" prop="access_key">
              <Input v-model="formItem.access_key" placeholder="请填入你的ACCESS_KEY" />
            </Form-item>
            <Form-item label="SECRET_KEY" prop="secret_key">
              <Input v-model="formItem.secret_key" placeholder="请填入你的SECRET_KEY" />
            </Form-item>
            <Form-item label="区域" prop="region">
              <Select v-model="formItem.region">
                <Option v-for="item in regions" :value="item.region" :key="item.region">{{ item.name }}</Option>
              </Select>
            </Form-item>
            <!-- <Form-item label="分页" prop="paging">
              <i-switch v-model="formItem.paging" />
              <Icon style="margin-left: 20px;" @click="openBrowser('https://github.com/willnewii/qiniuClient/wiki/%E6%95%B0%E6%8D%AE%E5%8A%A0%E8%BD%BD%E6%96%B9%E5%BC%8F')" type="md-help-circle" />
            </Form-item> -->
          </template>

          <Form-item>
            <div class="buttons">
              <Button type="primary" @click="handleSubmit(item.key)">设置</Button>
              <Button @click="handleReset(item.key)" style="margin-left: 8px;">重置</Button>
            </div>
          </Form-item>
          <div style="margin-left: 150px;">
            请选择对应的区域
          </div>
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { Constants, mixins } from '../service'
import brand from '@/cos/brand'
import Regions from '@/cos/Regions'
import * as types from '@/vuex/mutation-types'

export default {
  mixins: [mixins.base],
  data() {
    return {
      selectBrand: brand.xiang,
      formItem: {
        service_name: '',
        access_key: '',
        secret_key: '',
        region: '',
        endpoint: '',
        internal: false,
        paging: false,
        name: ''
      },
      ruleItem: {
        access_key: [{ required: true, message: 'access_key不能为空', trigger: 'blur' }],
        secret_key: [{ required: true, message: 'secret_key不能为空', trigger: 'blur' }],
        region: [{ required: true, message: 'region不能为空', trigger: 'blur' }],
        service_name: [{ required: true, message: 'service_name不能为空', trigger: 'blur' }]
      },
      brands: brand,
      coses: [],
      regions: Regions.xiang
    }
  },
  computed: {},
  created: function() {
    this.getCOS()
    this.handleReset()
  },
  mounted() {},
  methods: {
    ...mapActions([types.setup.a_paging]),
    onTabClick(key) {
      if (key !== '已登录') {
        this.selectBrand = this.brands[key]
        this.handleReset()
      }
      //   if (key === this.brands.aws.key) {
      //     this.regions = Regions.s3
      //   } else if (key === this.brands.jd.key) {
      //     this.regions = Regions.jd
      //   } else if (key === this.brands.ks3.key) {
      //     this.regions = Regions.ks3
      //   }

      console.log(Regions)
      this.regions = Regions.xiang
    },
    handleSubmit(key) {
      //   if (key !== brand.upyun.key) {
      //     this.formItem.service_name = '-'
      //   }
      this.formItem.service_name = '-'
      this.$refs[key][0].validate(valid => {
        if (valid) {
          this.validateKey()
        } else {
          console.log('表单不能提交')
        }
      })
    },
    handleReset() {
      this.formItem = this.$options.data().formItem
      this.formItem.name = this.selectBrand.name
    },
    validateKey() {
      let item = Object.assign(
        {
          key: this.selectBrand.key
        },
        this.formItem
      )

      console.log('validateKey', item)

      this.$storage.initCOS(item)
      this.$storage.getBuckets(error => {
        if (error) {
          this.$Notice.error({ title: this.selectBrand.name, desc: error.message })
        } else {
          this.$storage.saveCosKey(item, () => {
            this[types.setup.a_paging](this.formItem.paging)
            this.openCOS(item)
          })
        }
      })
    },
    openCOS(item) {
      this.$router.push({ name: Constants.PageName.main, params: { cos: item } })
    },
    removeCOS(item) {
      this.$storage.cleanCosKey(item, () => {
        this.getCOS()
      })
    },
    getCOS() {
      this.$storage.getBindCoses(({ coses }) => {
        this.coses = coses
        if (this.coses.length === 0) {
          this.$refs['tabs'].activeKey = this.$refs['tabs'].getTabs()[1].name
        }
      })
    },
    openBrowser(url) {
      this.$electron.shell.openExternal(url)
    }
  }
}
</script>
